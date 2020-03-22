// @ts-ignore
import App from "next/app";
import React from "react";

const layoutNoop = page => page;

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    const getLayout = (Component as any).getLayout || layoutNoop;
    return getLayout(<Component {...pageProps} />, pageProps);
  }
}
