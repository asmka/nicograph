/*
Copyright (c) 2017 noradium
Released under the MIT license
https://github.com/noradium/dac/blob/master/src/scripts/hack_fetch_thread.js
*/

import { overwriteCmtGraph } from "./lib/cmt_graph";

try {
  init();
} catch (error) {
  console.error("[ERROR] Failed to hack getNicoads function", error);
}

function init() {
  const libraryFunctions = window["webpackChunkwatch"][0][1];
  const nicoadsModuleIndex = Object.keys(libraryFunctions).find((index) => {
    const func = libraryFunctions[index];
    return func && !!func.toString().match(/\.getSponsors\s?=\s?function/);
  });

  // Overwrite the library that includes getSponsors function
  const originalNicoadsModule = libraryFunctions[nicoadsModuleIndex];

  libraryFunctions[nicoadsModuleIndex] = function (e, t, n) {
    originalNicoadsModule(e, t, n);

    // Find getNicoads function
    const getNicoadsBlockPropertyName = Object.getOwnPropertyNames(
      e.exports
    ).find((propertyName) => {
      return (
        e.exports[propertyName].prototype &&
        typeof e.exports[propertyName].prototype.getSponsors === "function"
      );
    });
    const originalGetNicoadsFunction =
      e.exports[getNicoadsBlockPropertyName].prototype.getSponsors;

    // Overwrite getNicoads function
    e.exports[getNicoadsBlockPropertyName].prototype.getSponsors = function () {
      return originalGetNicoadsFunction
        .call(this, ...arguments)
        .then((nicoads) => {
          // Add custom process
          if (nicoads) {
            try {
              overwriteCmtGraph({ isNicoads: true });
            } catch (err) {
              console.error("[ERROR] Failed to do custom getSponsors", err);
            }
          }
          // Return original Promise
          return nicoads;
        });
    };
  };
}
