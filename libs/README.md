# Libs

The `libs` directory is home to any libraries shared across studio applications.

## Creating a new library

A library has 3 requirements

1. It must include a `tsconfig.json` with at least the following contents

```json
{
  "extends": "../../config/tsconfig.lib.json",
  "include": ["src/**/*.tsx", "src/**/*.ts", "types/*.ts"],
  "compilerOptions": {
    "rootDir": "src",
    "outDir": ".ts-out"
  }
}
```

2. It must contain a `src` directory where all the code lives
3. It must contain and `index.ts` which exports everything that is usable outside the library

## Using a library

If you've created a library and want to use it somewhere else in studio (either in an app or a library), there are two things you need to know

1. To import the library from somewhere else use `@artsy-studio/<library-name>`
2. You _must_ add the `<library-name>` as `references` in the `tsconfig.json` of the place it's used.

For example, if you created a library call `widgets` and wanted to use it in the `studio` app, you would add the following to the `studio` app's `tsconfig.json`:

```json
{
  "references": [{ "path": "../../widgets" }]
}
```

It's a bit cumbersome for now, but it's on the roadmap to automate away this requirement.
