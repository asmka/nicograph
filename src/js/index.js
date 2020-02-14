/*
Copyright (c) 2017 noradium
Released under the MIT license
https://github.com/noradium/dac/blob/master/src/scripts/index.js
*/

// Attension:
// This is a temporary solution for freeze when danime-another-comment extension
// is loaded prior than this one.
setTimeout(() => {
    inject(chrome.extension.getURL('js/hack_fetch_thread.js'));
    const watchAppJsURI = getWatchAppJsURI();
    inject(`${watchAppJsURI}${watchAppJsURI.indexOf('?') === -1 ? '?' : '&'}by-nicograph`);
});

function inject(src) {
    const s = document.createElement('script');
    s.setAttribute('type', 'text/javascript');
    s.setAttribute('src', src);

    document.body.appendChild(s);
}

function getWatchAppJsURI() {
    const scriptTags = Array.from(document.getElementsByTagName('script'));
    const watchAppJsRegExp = /watch_app_.*\.js/;

    // Attension:
    // There are two URIs which are "watch_app_*.js" and 
    // "watch_app_*?by-danime-another-comment.js" if 
    // danime-another-comment extension is introduced.
    // So, we get "watch_app_*?by-danime-another-comment.js"
    // for enabling both extensions that include ourself.
    const target = scriptTags.filter((script) => {
        return watchAppJsRegExp.test(script.src);
    }).pop();

    return target.src;
}
