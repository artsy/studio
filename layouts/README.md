## Layouts

Files in this directly are layout files _specifically_ for MDX. Layouts are used to determine how the MDX files will
be rendered.

Creating layouts for mdx files is a bit of a special case. To define layout files you need to name them specially.
The format is `<layout>.tsx` where `<layout>` is the name of your layout. For example, to provide a layout
for all `.mdx` files in `pages/blogs` you'd define `blogs.tsx`.

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
