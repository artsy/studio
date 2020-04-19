module.exports = {
  presets: ["next/babel"],
  plugins: [
    require("./tools/babel/defaultLayout"),
    [
      "styled-components",
      {
        ssr: true,
        displayName: true,
        preprocess: false,
      },
    ],
  ],
};
