module.exports = {
  mode: "production",
  entry: {
    index: "./src/index.js",
    hack_lib: ["./src/hack_fetch_thread.js", "./src/hack_get_nicoads.js"],
    background: "./src/background.js",
  },
  output: {
    filename: "[name].js",
  },
};
