/* eslint-disable semi */
'use strict';

const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();
// const concat = require('gulp-concat');

// Copy .htaccess file to dist to force HTTPS
gulp.task('root', function () {
  return gulp.src('src/root/.htaccess')
    .pipe(gulp.dest('dist'));
});

// Copy favicons to dist
gulp.task('favicons', function () {
  return gulp.src('src/favicons/*')
    .pipe(gulp.dest('dist/favicons'));
});

// Copy fonts to dist
gulp.task('fonts', function () {
  return gulp.src('src/fonts/*')
    .pipe(gulp.dest('dist/fonts'));
});

// Copy images to dist
gulp.task('images', function () {
  return gulp.src('src/images/*')
    .pipe(gulp.dest('dist/images'));
});

// Copy videos to dist
gulp.task('videos', function () {
  return gulp.src('src/videos/*')
    .pipe(gulp.dest('dist/videos'));
});

// Compile Pug files into HTML
gulp.task('pug', function () {
  return gulp.src('src/pug/index.pug')
    .pipe(pug())
    .pipe(gulp.dest('dist'));
});

// Compile SCSS files to CSS
sass.compiler = require('node-sass');

gulp.task('sass', function () {
  return gulp.src('src/sass/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
});

// JavaScript
gulp.task('js', () =>
  gulp.src('src/js/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['@babel/preset-env']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
);

// // browserSync and file watching
gulp.task('serve', function () {
  browserSync.init({
    server: 'dist'
    // browser: 'FireFox'
  });

  gulp.watch(['src/pug/*.pug', 'src/svg/*.svg'], gulp.series('pug'));
  gulp.watch('src/sass/*.scss', gulp.series('sass'));
  gulp.watch('src/js/*.js', gulp.series('js'));
  gulp.watch(['dist/index.html', 'dist/js/*.js']).on('change', browserSync.reload);
});

gulp.task('default', gulp.series('serve'));
gulp.task('build', gulp.parallel('root', 'favicons', 'fonts', 'images', 'videos', 'pug', 'sass', 'js'));
