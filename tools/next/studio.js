const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const withTM = require("next-transpile-modules")(["lodash-es"]);
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const withMDX = require("next-mdx-enhanced")({
  layoutPath: "src/layouts",
  defaultLayout: true,
  extendFrontMatter: {
    process: (_, frontMatter) => {
      const { __resourcePath, layout } = frontMatter;
      if (!layout) {
        const defaultLayout = __resourcePath.split("/")[0];
        if (
          fs.existsSync(
            path.join(process.cwd(), `layouts/${defaultLayout}.tsx`)
          )
        ) {
          return {
            layout: defaultLayout,
          };
        }
      } else {
        return {
          layout: layout,
        };
      }
    },
    phase: "both",
  },
});

module.exports = function withStudio({ webpack: webpackCallback, ...config }) {
  const studioWebpack = (config, ...args) => {
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /@artsy-studio\/(.+)/,
        (resource) => {
          resource.request =
            resource.request.replace(
              "@artsy-studio",
              path.resolve(__dirname, "../../libs")
            ) + "/.ts-out";
        }
      ),
      new webpack.NormalModuleReplacementPlugin(
        /^(components|pages|lib)\/(.+)/,
        (resource) => {
          const root = path.resolve(__dirname, "../..");
          const project = path.relative(root, resource.context).split("src")[0];
          resource.request = path.join(root, project, "src", resource.request);
        }
      )
    );
    if (webpackCallback) {
      return webpackCallback(config, ...args);
    }
    return config;
  };

  return withBundleAnalyzer(
    withTM(
      withMDX({
        webpack: studioWebpack,
        ...config,
      })
    )
  );
};
