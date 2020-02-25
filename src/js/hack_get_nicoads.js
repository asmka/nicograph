/*
Copyright (c) 2017 noradium
Released under the MIT license
https://github.com/noradium/dac/blob/master/src/scripts/hack_fetch_thread.js
*/

import CmtGraph from "./lib/cmt_graph";

try {
    init();
} catch (error) {
    console.error('[ERROR] Failed to hack getNicoads function', error);
}

function init() {
    let cmtGraph = new CmtGraph();
    const libraryFunctions = window['webpackJsonp'][0][1];
    const nicoadsModuleIndex = libraryFunctions.findIndex((item) => {
        return item && !!item.toString().match(/\.getNicoads\s?=\s?function/);
    });

    // Overwrite the library that includes getNicoads function
    const originalNicoadsModule = libraryFunctions[nicoadsModuleIndex];

    libraryFunctions[nicoadsModuleIndex] = function (e, t, n) {
        originalNicoadsModule(e, t, n);

        // Find getNicoads function
        const getNicoadsBlockPropertyName = Object.getOwnPropertyNames(e.exports).find((propertyName) => {
            return e.exports[propertyName].Client.prototype && typeof e.exports[propertyName].Client.prototype.getNicoads === 'function';
        });
        const originalGetNicoadsFunction = e.exports[getNicoadsBlockPropertyName].Client.prototype.getNicoads;

        // Overwrite getNicoads function
        e.exports[getNicoadsBlockPropertyName].Client.prototype.getNicoads = function () {
            return originalGetNicoadsFunction.call(this, ...arguments)
                .then((val) => {
                    // DEBUG
                    console.debug('Called hacked getNicoads');
                    console.debug(val);
                    // Add custom process
                    if (val) {
                        cmtGraph.overwriteCmtGraph({isNicoads: true});
                    }
                    // Return original Promise
                    return val;
                }).catch((err) => {
                    console.error("[ERROR] Failed to get nicoads", err);
                });
        }
    };
}
