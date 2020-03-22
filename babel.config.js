module.exports = {
  presets: ["next/babel"],
  plugins: [
    require("./scripts/babel/defaultLayout"),
    [
      "styled-components",
      {
        ssr: true,
        displayName: true,
        preprocess: false
      }
    ]
  ]
};
