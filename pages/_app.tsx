// @ts-ignore
import App from "next/app";
import React from "react";

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    console.log(this.props);
    return (
      <>
        <Component {...pageProps} />
      </>
    );
  }
}
