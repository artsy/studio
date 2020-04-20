# Patches

This directory contains patches for [patch-package](https://github.com/ds300/patch-package#readme)

If you add a new patch you _must_ describe what the patch does and why it's needed in this file.

## Patch Details

Below are descriptions of the current patches and why they're needed

### next+9.3.5.patch

Next.js uses babel instead of the Typescript compiler to compile code. That in itself is fine, but they have some automated tooling to help consumers of Next ensure Typescript isn't doing more work than it needs to. Specifically when you run `next dev`, `next build`, etc it will check your tsconfig file for that project and inject `noEmit: true` if it doesn't already exist (it also injects other things, but we don't care about this). `noEmit` is a problem for this project because we use Typescript's [composite](https://www.typescriptlang.org/docs/handbook/project-references.html) build feature which _errors out_ if `noEmit` is present in the config (even if it's false). Given that we're using `composite` I've removed the `noEmit` auto addition as well as a default that runs the tsc webpack plugin inside of Next w/ `noEmit` enabled.
