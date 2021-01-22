/*
Copyright (c) 2017 noradium
Released under the MIT license
https://github.com/noradium/dac/blob/master/src/scripts/hack_fetch_thread.js
*/

import { createCmtGraph } from "./lib/cmt_graph";

try {
  init();
} catch (error) {
  console.error("[ERROR] Failed to hack fetchThread function", error);
}

function init() {
  const libraryFunctions = window["webpackChunkwatch"][0][1];
  const commentClientFunctionIndex = Object.keys(libraryFunctions).find(
    (index) => {
      const func = libraryFunctions[index];
      return func && !!func.toString().match(/\.fetchThread\s?=\s?function/);
    }
  );

  // Overwrite fetch comment library
  const originalCommentClientFunction =
    libraryFunctions[commentClientFunctionIndex];

  libraryFunctions[commentClientFunctionIndex] = function (e, t, n) {
    originalCommentClientFunction(e, t, n);

    const fetchThreadBlockPropertyName = Object.getOwnPropertyNames(
      e.exports
    ).find((propertyName) => {
      return (
        e.exports[propertyName].prototype &&
        typeof e.exports[propertyName].prototype.fetchThread === "function"
      );
    });
    const originalFetchThread =
      e.exports[fetchThreadBlockPropertyName].prototype.fetchThread;

    e.exports[
      fetchThreadBlockPropertyName
    ].prototype.fetchThread = function () {
      return originalFetchThread.call(this, ...arguments).then((threads) => {
        // Add custom processing
        try {
          createCmtGraph(threads);
        } catch (err) {
          console.error("[ERROR] Failed to do custom fetchThread", err);
        }
        // Return original Promise
        return threads;
      });
    };
  };
}
