/* Copyright 2017 Novartis Institutes for BioMedical Research Inc. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License. */

/*
    eslint
    no-var: 0,
    prefer-arrow-callback: 0,
    prefer-template: 0,
    no-console: 0
*/

// browserify transform for transpiling es6/jsx (used during bundling)
var babelify = require('babelify');

var browserify = require('browserify');
var browserSync = require('browser-sync').create();
var eslint = require('gulp-eslint');
var fs = require('fs');
var gulp = require('gulp');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var runSequence = require('run-sequence');
var watchify = require('watchify');
var sass = require('gulp-sass');
var concatCss = require('gulp-concat-css');

// babel config from `projectRoot/.babelrc`
var babelrc = JSON.parse(fs.readFileSync('.babelrc', 'utf-8'));

var browserifyConfig = {
    entries: ['./src/js/index.js'],
    debug: true, // enable sourcemaps by default
    transform: [[babelify, babelrc]],
};
var watchifyConfig = Object.assign({}, browserifyConfig, {
    cache: {},
    packageCache: {},
    plugin: [watchify],
});

/* bundlers:
    `b` is vanilla browserify
    `w` watches + caches packages */
var b = browserify(browserifyConfig);
var w = browserify(watchifyConfig)
        .on('update', function (changes) {
            console.log('File(s) changed...', changes);
            runSequence(['bundle:watch']);
        });

var doBundle = function (done) {
    return (this.watchify ? w : b)
        .bundle()
        .on('error', function (err) {
            gutil.log('Browserify error\n' + err.toString() + '\n' + err.codeFrame);
            done();
        })
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('./dist/js'));
};

/**
 * GENERAL BUILD TASKS
 */

// bundle task for single builds, no watchify
gulp.task('bundle', doBundle.bind({ watchify: false }));

gulp.task('bundle:watch', doBundle.bind({ watchify: true }));

gulp.task('watch', function () {
    gulp.watch('./src/*.html', ['html']);
    gulp.watch('./dist/**', browserSync.reload);
});

gulp.task('sass', function () {
    gulp.src('./src/sass/*')
        .pipe(sass().on('error', sass.logError))
        .pipe(concatCss('style.css'))
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('assets', function () {
    gulp.src('./src/assets/**')
        .pipe(gulp.dest('./dist/assets'));
});

gulp.task('html', function () {
    gulp.src('./src/*.html').pipe(gulp.dest('./dist/'));
});

gulp.task('serve', function () {
    browserSync.init({
        port: 3000,
        server: {
            baseDir: './dist',
        },
        ghostMode: false,
    });
});

gulp.task('lint', function () {
    return gulp.src(['./src/js/**/*.js', '!./node_modules/**'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

/**
 * DEFAULT TASKS
 */

gulp.task('static', ['html', 'assets', 'sass']);

gulp.task('default', function (cb) {
    runSequence('static', 'watch', 'bundle:watch', 'serve', cb);
});
