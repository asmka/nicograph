/*
Copyright (c) 2017 noradium
Released under the MIT license
https://github.com/noradium/dac/blob/master/src/scripts/hack_fetch_thread.js
*/

import {overwriteCmtGraph} from "./lib/cmt_graph";

try {
    init();
} catch (error) {
    console.error('[ERROR] Failed to hack getNicoads function', error);
}

function init() {
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
                .then((nicoads) => {
                    // Add custom process
                    if (nicoads) {
                        try {
                            overwriteCmtGraph({isNicoads: true});
                        } catch (err) {
                            console.error("[ERROR] Failed to do custom getNicoads", err);
                        }
                    }
                    // Return original Promise
                    return nicoads;
                });
            
        }
    };
}
