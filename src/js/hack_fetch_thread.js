/*
Copyright (c) 2017 noradium
Released under the MIT license
https://github.com/noradium/dac/blob/master/src/scripts/hack_fetch_thread.js
*/

import CmtGraph from "./lib/cmt_graph";

try {
    init();
} catch (error) {
    console.error('[ERROR] Failed to hack fetchThread function', error);
}

function init() {
    let cmtGraph = new CmtGraph();
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
                    // DEBUG
                    console.debug('Called hacked fetchThread');
                    // Add custom processing
                    cmtGraph.createCmtGraph(threads);
                    // Return original Promise
                    return threads;
                }).catch((err) => {
                    console.error("[ERROR] Failed to fetch thread", err);
                });
        };
    };
}
