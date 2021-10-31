/*
Copyright (c) 2017 noradium
Released under the MIT license
https://github.com/noradium/dac/blob/master/src/scripts/index.js
*/

const hackLibScript = createScript(chrome.extension.getURL("js/hack_lib.js"));
hackLibScript.onload = function() {
  const watchAppJsURI = getWatchAppJsURI();
  const watchAppScript = createScript(
    `${watchAppJsURI}${watchAppJsURI.indexOf("?") === -1 ? "?" : "&"}by-nicograph`
  );
  document.body.appendChild(watchAppScript);
}
document.body.appendChild(hackLibScript);


function createScript(src) {
  const s = document.createElement("script");
  s.setAttribute("type", "text/javascript");
  s.setAttribute("src", src);
  return s;
}

function getWatchAppJsURI() {
  const scriptTags = Array.from(document.getElementsByTagName("script"));
  const watchAppJsRegExp = /watch_app_.*\.js/;

  // Attension:
  // There are two URIs which are "watch_app_*.js" and "watch_app_*?by-<extention name>.js"
  // if another extension is introduced which overwrites watchApp with the same method.
  // Then, we get "watch_app_*?by-<extension name>.js" for enabling all extensions which
  // include this one,
  // As a result, we inject "watch_app_*?by-<extension name>&by-nicograph.js".
  const target = scriptTags
    .filter((script) => {
      return watchAppJsRegExp.test(script.src);
    })
    .pop();

  return target.src;
}
