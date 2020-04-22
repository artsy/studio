<p align="center">
<img width="565" alt="image" src="https://user-images.githubusercontent.com/3087225/77610040-f97e4180-6ef7-11ea-9881-093606ff0157.png">
</p>

---

We apply keystrokes instead of brushstrokes and paint in pixels instead of pigments so our studio is adapted to this medium.

This is the space where we can put our tools and guide our thoughts to assist us in our mission to bring more art to the world.

Studio is intended to be a _simple to use_ mechanism to rapidly spin up new internal tools and features at Artsy to enable us to reach our mission of expanding the art market to support more artists and art in the world. To achieve this, Studio makes some highly opinionated decisions:

- Everything in one repo to make it easy to know where to look
- Only manage dependencies in one place (via a single `package.json`) to enforce responsible dependency choices and consistent versions across all apps
- Performance is paramount both in building and serving applications. Bundles should be small and builds incremental.

## Getting Started

To run an app in development mode

```bash
yarn dev <app-name>
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Artsy team members should copy over the .env values from 1pass to get the app to fully work. For our open source friends, some parts of the app may not function.

## To create a new app

This will generate and start a new app for you

```bash
yarn generate app <app-name>
```

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
