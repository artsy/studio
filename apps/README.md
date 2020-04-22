# Apps

This directory contains all individual applications that make up studio. All applications are, for now, [Next.js](https://nextjs.org/) apps with some enhancements to make development easier.

## Running an app

To run an app in development mode run `yarn dev <app>`

## Creating a new app

Creating an app is simple. Just run `yarn generate app <app-name>`.

You app will start automatically in dev mode.

If you'd like to just see what would be generated without actually writing anything, run the generator in `dry-run` mode.

```
yarn generate app <app-name> --dry-run
```

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
