## Layouts

Layouts allows us to customize the shell of a particular set of pages based on path.

For example, if we want to give all pages in `pages/blog` a particular layout, we can create a `blog.tsx` file
here. Currently layouts are only supported one level deep. For example, you can have a layout for `pages/blog` but
not a custom layout for `pages/blog/epic`. If there's a need for that we can always add it later.

### Page Layouts

A layout component is simple. It's a react component that's exported as default. You _must_ render children. The rest of the props are whatever props are passed to the page by nextjs.

```
export default ({ children, ...props}) => {
  return (
    <section>
      {children}
    </section>
  )
}
```

#### Overriding layouts

Sometimes you may want to override the default layout. This is pretty simple to do!

In your page, just attach a `Layout` component to the page export.

For example

```
const Page = () => <h1>My next.js page</h1>

Page.Layout = ({ children }) => {
  <main>
    {children}
  </main>
}

export default Page
```

This is a somewhat contrived example, but defining `Layout` means that the default layout won't be provided.

### MDX Layouts

Creating layouts for mdx files is a bit of a special case. To define layout files you need to name them specially.
The format is `<layout>.mdx.tsx` where `<layout>` is the name of your layout. For example, to provide a layout
for all `.mdx` files in `pages/blogs` you'd define `blogs.mdx.tsx`.

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
