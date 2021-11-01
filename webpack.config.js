module.exports = {
  mode: "production",
  entry: {
    index: "./src/js/index.js",
    hack_lib: ["./src/js/hack_fetch_thread.js", "./src/js/hack_get_nicoads.js"],
    background: "./src/js/background.js",
  },
  output: {
    filename: "[name].js",
  },
};
