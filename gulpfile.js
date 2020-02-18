const fs = require('fs');
const cproc = require('child_process');

const gulp = require('gulp');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');

const webpackDevConfig = require('./webpack.dev.js');
const webpackProdConfig = require('./webpack.prod.js');

const manifestFile = 'manifest.json';
const iconsDir = 'images/icons';
const releaseDir = 'release';
const zipFile = 'release.zip';

const objectDirs = [
    releaseDir
];

const objectFiles = [
    zipFile
];

function clean(cb) {
    let promises = [];

    // Remove directories
    objectDirs.forEach((dir) => {
        promises.push(new Promise((resolve, reject) => {
            fs.rmdir(dir, {recursive: true}, (err) => {
                if (err && err.code !== 'ENOENT') {
                    reject(err);
                }
                resolve();
            });
        }));
    });

    // Remove files
    objectFiles.forEach((file) => {
        promises.push(new Promise((resolve, reject) => {
            fs.unlink(file, (err) => {
                if (err && err.code !== 'ENOENT') {
                    reject(err);
                }
                resolve();
            });
        }));
    });

    Promise.all(promises)
        .then((results) => {
            cb();
        }).catch((err) => {
            cb(err);
        });
}

function makeObjectDirs(cb) {
    let promises = [];

    // Create directories
    objectDirs.forEach((dir) => {
        promises.push(new Promise((resolve, reject) => {
            fs.mkdir(dir, (err) => {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        }));
    });

    Promise.all(promises)
        .then((results) => {
            cb();
        }).catch((err) => {
            cb(err);
        });
}

function buildProdJs() {
    return webpackStream(webpackProdConfig, webpack)
        .pipe(gulp.dest(`${releaseDir}/js`));
}

function buildDevJs() {
    return webpackStream(webpackDevConfig, webpack)
        .pipe(gulp.dest(`${releaseDir}/js`));
}

function copyManifest(cb) {
    fs.copyFile(manifestFile, `${releaseDir}/${manifestFile}`, (err) => {
        if (err) {
            cb(err);
        }
        cb();
    });
}

function copyIcons() {
    return gulp.src(`${iconsDir}/*`)
        .pipe(gulp.dest(`${releaseDir}/icons`));
}

function zipping(cb) {
    cproc.exec(`zip -r ${zipFile} ${releaseDir}`, (err, stdout, stderr) => {
        if (err) {
            cb(err);
        }
        cb();
    });
}

exports.clean= gulp.series(
    clean
);

exports.prod = gulp.series(
    clean,
    makeObjectDirs,
    buildProdJs,
    copyManifest,
    copyIcons,
    zipping
);

exports.dev = gulp.series(
    clean,
    makeObjectDirs,
    buildDevJs,
    copyManifest,
    copyIcons,
    zipping
);

exports.default = this.prod;
