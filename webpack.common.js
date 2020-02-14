module.exports = {
    entry: {
        index: './src/js/index.js',
        hack_fetch_thread: './src/js/hack_fetch_thread.js',
        background: './src/js/background.js'
    },
    output: {
        filename: '[name].js'
    }
};
