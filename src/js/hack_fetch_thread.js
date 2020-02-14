/*
Copyright (c) 2017 noradium
Released under the MIT license
https://github.com/noradium/dac/blob/master/src/scripts/hack_fetch_thread.js
*/

import createCmtGraph from "./lib/create_cmt_graph";

try {
    init();
} catch (error) {
    console.error('[ERROR] Failed to initialize nicograph', error);
}

function init() {
    const libraryFunctions = window['webpackJsonp'][0][1];
    const commentClientFunctionIndex = libraryFunctions.findIndex((item) => {
        // Now, fetchThread is the library to fetch comments
        return item && !!item.toString().match(/\.fetchThread\s?=\s?function/);
    });

    // Overwrite fetch comment library
    const originalCommentClientFunction = libraryFunctions[commentClientFunctionIndex];
    libraryFunctions[commentClientFunctionIndex] = function (e, t, n) {
        originalCommentClientFunction(e, t, n);

        const fetchThreadBlockPropertyName = Object.getOwnPropertyNames(e.exports).find((propertyName) => {
            return e.exports[propertyName].prototype && typeof e.exports[propertyName].prototype.fetchThread === 'function';
        });
        const originalFetchThread = e.exports[fetchThreadBlockPropertyName].prototype.fetchThread;

        e.exports[fetchThreadBlockPropertyName].prototype.fetchThread = function () {
            return originalFetchThread.call(this, ...arguments)
                .then((threads) => {
                    // Add custom processing
                    createCmtGraph(threads);
                    return threads;
                }).catch((err) => {
                    console.error("[ERROR] Failed to fetch thread", err);
                });
        };
    };
}
