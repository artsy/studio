# Generators

This directory holds all the generators that are accessible via `yarn generate`.

## Creating a new generator

There's a generator to generate new generators.

```bash
yarn generate generator <generator-name>
```

## Understanding generators

Generators have two parts:

1. File generators - Creates a new file
2. File modifiers - Edits an existing file

All generated outputs get run through prettier
