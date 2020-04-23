import {
  generator,
  FileGenerator,
  FileModifier,
} from "./helpers/baseGenerator";
import { command } from "./helpers/command";
import { spawn } from "child_process";
import { blue } from "kleur";
import fs from "fs";

const pkg = JSON.parse(
  fs.readFileSync(`${__dirname}/../../package.json`, {
    encoding: "utf-8",
  })
);

const generators: FileGenerator[] = [
  {
    filePath: "tsconfig.json",
    content: (app: string) => `
      {
        "extends": "../../config/tsconfig.app.json",
        "include": ["src/**/*.tsx", "src/**/*.ts", "next-env.d.ts"],
        "references": [{ "path": "../../libs" }],
        "compilerOptions": {
          "rootDir": "src",
          "outDir": ".ts-out",
          "paths": {
            "libs/*": ["libs/*"],
            "*": ["apps/${app}/src/*", "*"]
          },
          "allowJs": true,
          "resolveJsonModule": true
        },
        "exclude": ["node_modules"]
      }`,
  },
  {
    filePath: "src/pages/index.tsx",
    content: (app: string) => `
      const Index = () => {
        return (
          <>
            <h1>Welcome to ${app}</h1>
          </>
        )
      }

      export default Index
      `,
  },
  {
    filePath: "babel.config.js",
    content: `module.exports = require("../../babel.config");`,
  },
  {
    filePath: "src/pages/_app.tsx",
    content: `export { App as default } from "libs/next";`,
  },
  {
    filePath: "src/pages/_document.tsx",
    content: `export { Document as default } from "libs/next";`,
  },
  {
    filePath: "next.config.js",
    content: (app) => `
      const assetPrefix = process.env.BUILDING_FOR_NOW ? "/${app}" : "";
      const withStudio = require("../../tools/next/studio");

      module.exports = withStudio({
        assetPrefix,
        env: {
          ASSET_PREFIX: assetPrefix,
        },
      });
    `,
  },
  {
    filePath: "package.json",
    content: (app) => `
      {
        "name": "${app}",
        "private": true,
        "description": "GENERATED, DO NOT EDIT",
        "scripts": {
          "now-build": "../../tools/scripts/build.sh"
        },
        "dependencies": {
          "next": "${pkg.dependencies.next}"
        }
      }
    `,
  },
];

const modifiers: FileModifier[] = [
  {
    basePath: "",
    filePath: "tsconfig.json",
    modifier: (content, { defaultBasePath }) => {
      const tsconfig = JSON.parse(content);
      tsconfig.references.push({ path: defaultBasePath });
      return JSON.stringify(tsconfig);
    },
  },
  {
    basePath: "",
    filePath: "now.json",
    modifier: (content, { name, defaultBasePath }) => {
      const now = JSON.parse(content);
      now.builds.unshift({
        src: `${defaultBasePath}/package.json`,
        use: "@now/next",
      });
      now.routes.unshift({
        src: `/${name}(.*)`,
        dest: `${defaultBasePath}/$1`,
      });
      return JSON.stringify(now);
    },
  },
];

export const app = command(
  "app",
  (name, dryRun) =>
    generator({
      name,
      basePath: `apps/${name}`,
      generators,
      modifiers,
      dryRun,
    }),
  (name) => {
    console.log(blue(`App ${name} created, starting it now...`));
    spawn("yarn", ["dev", name], {
      stdio: [process.stdin, process.stdout, process.stderr],
    });
  }
);
