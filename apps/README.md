# Apps

This directory contains all individual applications that make up studio. All applications are, for now, [Next.js](https://nextjs.org/) apps with some enhancements to make development easier.

## Running an app

To run an app in development mode run `dotenv next dev apps/<app>` from the _root_ of the studio repo.

## Creating a new app

There are several requirements to creating a new application. These will eventually be automated.

1. Create a directory of the application's name in `apps`
2. Add a `babel.config.js` to the application's root with the following contents:

```js
module.exports = require("../../babel.config");
```

3. Add a `tsconfig.json` with the following contents

```json
{
  "extends": "../../config/tsconfig.app.json",
  "include": ["src/**/*.tsx", "src/**/*.ts"],
  "exclude": ["node_modules"],
  "references": [
    { "path": "../../libs/next" }
  ]
  "compilerOptions": {
    "allowJs": true,
    "resolveJsonModule": true,
    "rootDir": "src",
    "outDir": ".ts-out"
  }
}
```

If you want to use any other libraries aside from `@artsy-studio/next` from `libs` you _must_ add a reference field for that library under `references`. This requirement will eventually be automated.

4. Create a `src` directory with a `pages` directory inside of it.
5. Inside of `src/pages` create a `_document.tsx` file with the following contents

```typescript
export { Document as default } from "@artsy-studio/next";
```

This provides a predefined [Next.js Document Component](https://nextjs.org/docs/advanced-features/custom-document) for the app that sets up styled-components, palette integration, loads font files, and provides style resets.

6. Inside of `src/pages` create a `_app.tsx` file with the following contents

```typescript
export { App as default } from "@artsy-studio/next";
```

This provides a predefined [Next.js App Component](https://nextjs.org/docs/advanced-features/custom-app) that enables us to use [layouts](#providing-a-page-layout) and setups provider's like Palette's [Theme provider]()

## Providing a page layout

A concept introduced by this app which isn't normally apart of Next.js is the ability to provide a layout for all pages in a directory.
Layouts for next.js pages are powered by files named `_layout.tsx`. For example, all the pages in `team/src/pages` share the same layout thanks to `team/src/pages/_layout.tsx`. When building, every page will look for a layout file in its directory or in any parent directory up to the pages directory. It will use the nearest `_layout` file to determine its layout (if one is present).

You can manually override the layout of any given page by attaching `.Layout` to the component. For example:

```jsx
const Page = () => {
  return <p>Test Page</p>;
};

// This will override any _layout file
Page.Layout = ({ children }) => (
  <>
    <h1>This is a test</h1>
    {children}
  </>
);

export default Page;
```

If you just want to _disable_ the layout for that file you can just set layout equal to null like `Page.Layout = null`.

## Customizing mdx pages

Layouts for mdx files are stored in the app's `src/layouts` directory.

Creating layouts for mdx files is a bit of a special case. To define layout files you need to name them specially. Every app should provide a default layout called `index.tsx` which would be stored in that app's `src/layouts` directory. The format is `<layout>.tsx` where `<layout>` is the name of your layout. For example, to provide a layout
for all `.mdx` files in `src/pages/blogs` you'd define `blogs.tsx`.

We use [next-mdx-enhanced](https://github.com/hashicorp/next-mdx-enhanced) to render our MDX files, so how we write
layout files is slightly different than with normal pages.

Here's an example MDX layout:

```
import React from "react";

export default frontMatter => {
  return ({ children }) => {
    return (
      <article>
        <h1>{frontMatter.title}</h1>
        {children}
      </article>
    );
  };
};
```

To learn more about how the MDX setup works, please refer to [next-mdx-enhanced](https://github.com/hashicorp/next-mdx-enhanced)'s docs
