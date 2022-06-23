module.exports = {
  mode: "production",
  entry: {
    loader: "./dist/loader.js",
    script: "./dist/scripts/main.js",
  },
  output: {
    filename: "[name].js",
  },
};
