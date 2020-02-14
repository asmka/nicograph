/*
Copyright (c) 2017 noradium
Released under the MIT license
https://github.com/noradium/dac/blob/master/src/scripts/background.js
*/

// Stop request for loading watch_app.js after watch_dll.js is overwritten
chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
        if (/watch_app_.*\.js/.test(details.url)) {
            return {cancel: details.url.indexOf('by-nicograph') === -1};
        }
    },
    {urls: ['<all_urls>']},
    ['blocking']
);

