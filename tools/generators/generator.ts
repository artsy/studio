import {
  FileGenerator,
  generator as gen,
  FileModifier,
} from "./helpers/baseGenerator";
import { command } from "./helpers/command";

const generators: FileGenerator[] = [
  {
    filePath: (name) => `${name}.ts`,
    content: (name) => `
      import { FileGenerator, FileModifier, generator } from "./helpers/baseGenerator";
      import { command } from "./helpers/command";

      const generators: FileGenerator[] = [
        // file generators go here
      ]

      const modifiers: FileModifier[] = [
        // file modifiers go here
      ]

      export const ${name} = command("${name}", (name, dryRun) =>
        generator({ name, basePath: "some/path", generators, modifiers, dryRun })
      );
    `,
  },
];

const modifiers: FileModifier[] = [
  {
    filePath: `index.ts`,
    modifier: (content, { name }) => content + `export * from "./${name}";`,
  },
];

export const generator = command("generator", (name, dryRun) =>
  gen({ name, basePath: "tools/generators", generators, modifiers, dryRun })
);
