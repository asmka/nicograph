const fs = require('fs');
const gulp = require('gulp');
//const rename = require('gulp-rename');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');

const webpackDevConfig = require('./webpack.dev.js');
const webpackProdConfig = require('./webpack.prod.js');

const objectDirs = [
    'release'
];


function clean(cb) {
    let promises = [];
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
    Promise.all(promises)
        .then((results) => {
            cb();
        }).catch((err) => {
            cb(err);
        });
}

function makeObjectDirs(cb) {
    let promises = [];
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
        .pipe(gulp.dest('release/js'));
}

function buildDevJs() {
    return webpackStream(webpackDevConfig, webpack)
        .pipe(gulp.dest('release/js'));
}

function copyManifest(cb) {
    fs.copyFile('manifest.json', 'release/manifest.json', (err) => {
        if (err) {
            cb(err);
        }
        cb();
    });
}


exports.prod = gulp.series(
    clean,
    makeObjectDirs,
    buildProdJs,
    copyManifest
);

exports.dev = gulp.series(
    clean,
    makeObjectDirs,
    buildDevJs,
    copyManifest
);

exports.default = this.prod;
