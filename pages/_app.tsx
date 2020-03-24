// @ts-ignore
import App from "next/app";
import React from "react";
import { Theme, Serif, Sans } from "@artsy/palette";
import { MDXProvider } from "@mdx-js/react";
import { H1, H2, P } from "../components/Typography";

const layoutNoop = page => page;

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    const getLayout = (Component as any).getLayout || layoutNoop;
    return (
      <>
        <MDXProvider
          components={{
            h1: H1,
            h2: H2,
            p: P
          }}
        >
          <Theme>{getLayout(<Component {...pageProps} />, pageProps)}</Theme>
        </MDXProvider>
      </>
    );
  }
}
