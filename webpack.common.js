module.exports = {
    entry: {
        index: './src/js/index.js',
        hack_fetch_thread: './src/js/hack_fetch_thread.js',
        hack_get_nicoads: './src/js/hack_get_nicoads.js',
        background: './src/js/background.js'
    },
    output: {
        filename: '[name].js'
    }
};
