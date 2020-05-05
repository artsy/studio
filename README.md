<p align="center">
<img width="565" alt="image" src="https://user-images.githubusercontent.com/3087225/77610040-f97e4180-6ef7-11ea-9881-093606ff0157.png">
</p>

---

This project is just an experiment and not something actively used at Artsy. It seeks to answer the question, if Artsy had something like Spotify's backstage, what would that look like? 

## Getting Started

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Artsy team members should copy over the .env values from 1pass to get the app to fully work. For our open source friends, some parts of the app may not function.

## Providing a page layout

A concept introduced by this app which isn't normally apart of Next.js is the ability to provide a layout for all pages in a directory.
Layouts for next.js pages are powered by files named `_layout.tsx`. For example, all the pages in `pages/team` share the same layout thanks to `pages/team/_layout.tsx`. When building, every page will look for a layout file in its directory or in any parent directory up to the pages directory. It will use the nearest `_layout` file to determine its layout (if one is present).

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

Layouts for mdx files are stored in the `/layouts` directory.

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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/zeit/next.js/) - your feedback and contributions are welcome!

## Deploy on ZEIT Now

The easiest way to deploy your Next.js app is to use the [ZEIT Now Platform](https://zeit.co/import?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## About Artsy

<a href="https://www.artsy.net/">
  <img align="left" src="https://avatars2.githubusercontent.com/u/546231?s=200&v=4"/>
</a>

This project is the work of engineers at [Artsy][footer_website], the world's
leading and largest online art marketplace and platform for discovering art.
One of our core [Engineering Principles][footer_principles] is being [Open
Source by Default][footer_open] which means we strive to share as many details
of our work as possible.

You can learn more about this work from [our blog][footer_blog] and by following
[@ArtsyOpenSource][footer_twitter] or explore our public data by checking out
[our API][footer_api]. If you're interested in a career at Artsy, read through
our [job postings][footer_jobs]!

[footer_website]: https://www.artsy.net/
[footer_principles]: culture/engineering-principles.md
[footer_open]: culture/engineering-principles.md#open-source-by-default
[footer_blog]: https://artsy.github.io/
[footer_twitter]: https://twitter.com/ArtsyOpenSource
[footer_api]: https://developers.artsy.net/
[footer_jobs]: https://www.artsy.net/jobs
