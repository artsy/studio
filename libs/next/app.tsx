// @ts-ignore
import NextApp from "next/app";
import React from "react";
import { Theme } from "@artsy/palette";
import { MDXProvider } from "@mdx-js/react";
import { H1, H2, P } from "libs/components";

export class App extends NextApp {
  render() {
    const { Component, pageProps } = this.props;
    const Layout = (Component as any).Layout;
    return (
      <>
        <MDXProvider
          components={{
            h1: H1,
            h2: H2,
            p: P,
          }}
        >
          <Theme>
            {Layout ? (
              <Layout {...pageProps}>
                <Component {...pageProps} />
              </Layout>
            ) : (
              <Component {...pageProps} />
            )}
          </Theme>
        </MDXProvider>
      </>
    );
  }
}
