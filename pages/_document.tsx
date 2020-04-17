import Document, { Html, Head, Main, NextScript } from "next/document";
import { ServerStyleSheet } from "styled-components";
import { injectGlobalStyles } from "@artsy/palette";

const { GlobalStyles } = injectGlobalStyles();

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const { renderPage } = ctx;
    const sheet = new ServerStyleSheet();

    ctx.renderPage = () =>
      renderPage({
        enhancedApp: (App) => (props) =>
          sheet.collectStyles(<App {...props} />),
      });

    const initialProps = await Document.getInitialProps(ctx);

    const styleTags = sheet.getStyleElement();

    return { ...initialProps, styleTags };
  }

  render() {
    return (
      <Html>
        <Head>
          <GlobalStyles />
          <style>{`
            * {
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }

            #__next {
              height: 100%;
              padding: 0;
              margin: 0;
            }
          `}</style>
          <link
            type="text/css"
            rel="stylesheet"
            href="https://webfonts.artsy.net/all-webfonts.css"
          />
          {(this.props as any).styleTags}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
