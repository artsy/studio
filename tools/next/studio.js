const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const withTM = require("next-transpile-modules")(["lodash-es", "libs"]);
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
    config.resolve.modules = ["src", "node_modules"];
    if (!config.resolve.alias) {
      config.resolve.alias = {};
    }
    config.resolve.alias.libs = path.resolve(__dirname, "../../libs");
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
