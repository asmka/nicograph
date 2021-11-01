const path = require('path');

module.exports = {
  entry: {
    index: "./src/index.js",
    //hack_fetch_thread: './src/hack_fetch_thread.js',
    //hack_get_nicoads: './src/hack_get_nicoads.js',
    hack_lib: ["./src/hack_fetch_thread.js", "./src/hack_get_nicoads.js"],
    background: "./src/background.js",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, 'release'),
  },
  /*
    optimization: {
        splitChunks: {
            cacheGroups: {
                cmt_graph: {
                    name: 'cmt_graph',
                    chunks: 'all',
                    enforce: true
                }
            }
        },
    }
    */
};
