const fs = require("fs");
const path = require("path");

const withMDX = require("next-mdx-enhanced")({
  layoutPath: "layouts",
  defaultLayout: true,
  extendFrontMatter: {
    process: (_, frontMatter) => {
      const { __resourcePath, layout } = frontMatter;
      if (!layout) {
        const defaultLayout = __resourcePath.split("/")[0];
        if (
          fs.existsSync(
            path.join(process.cwd(), `layouts/${defaultLayout}.mdx.tsx`)
          )
        ) {
          return {
            layout: defaultLayout + ".mdx"
          };
        }
      } else {
        return {
          layout: layout + ".mdx"
        };
      }
    },
    phase: "both"
  }
});

module.exports = withMDX({});
