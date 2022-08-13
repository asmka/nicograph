module.exports = {
  mode: "production",
  entry: {
    content_script: "./dist/content_script.js",
    background: "./dist/background.js",
  },
  output: {
    filename: "[name].js",
  },
};
