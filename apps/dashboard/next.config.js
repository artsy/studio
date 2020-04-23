const assetPrefix = process.env.BUILDING_FOR_NOW ? "/dashboard" : "";
const withStudio = require("../../tools/next/studio");

module.exports = withStudio({
  assetPrefix,
  env: {
    ASSET_PREFIX: assetPrefix,
  },
});
