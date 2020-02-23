try {
    init();
} catch (error) {
    console.error('[ERROR] Failed to initialize nicograph', error);
}

function init() {
    const libraryFunctions = window['webpackJsonp'][0][1];
    const getNicoadsFunctionIndex = libraryFunctions.findIndex((item) => {
        return item && !!item.toString().match(/\.getNicoads\s?=\s?function/);
    });

    // Overwrite get nicoads library
    const originalGetNicoadsFunction = libraryFunctions[getNicoadsFunctionIndex];
    libraryFunctions[getNicoadsFunctionIndex] = function (e, t, n) {
        //originalGetNicoadsFunction(e, t, n);

        const getNicoadsBlockPropertyName = Object.getOwnPropertyNames(e.exports).find((propertyName) => {
            return e.exports[propertyName].prototype && typeof e.exports[propertyName].prototype.getNicoads === 'function';
        });
        const originalGetNicoads = e.exports[getNicoadsBlockPropertyName].prototype.getNicoads;

        e.exports[getNicoadsBlockPropertyName].prototype.getNicoads = function () {
            console.log(`[DEBUG] Called hacked getNicoads fucntion`);
            let a = originalGetNicoads.call(this, ...arguments);
            console.log(a);
            return a;
        };
    };
}

