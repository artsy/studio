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

module.exports = withMDX({});
