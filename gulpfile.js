/* eslint-disable semi */
var gulp = require('gulp');
var svgo = require('gulp-svgo');
var pug = require('gulp-pug');
var stylus = require('gulp-stylus');
var browserSync = require('browser-sync').create();

var site = 'public/';

// Compile Pug files into HTML
gulp.task('pug', function () {
  return gulp.src('src/pug/index.pug')
    .pipe(pug())
    .pipe(gulp.dest(site));
});

// Compile Stylus files into CSS
gulp.task('stylus', function () {
  return gulp.src('src/stylus/style.styl')
    .pipe(stylus({
      'include css': true
    }))
    .pipe(gulp.dest(site))
    .pipe(browserSync.stream());
});

// Clean SVGs
gulp.task('svgo', () => {
  return gulp.src('src/images/*.svg')
    .pipe(svgo(
      {
        plugins: [{
          removeTitle: false
        }, {
          removeDesc: false
        }, {
          removeXMLNS: true
        }, {
          removeUnknownsAndDefaults: {
            keepRoleAttr: true
          }
        }, {
          removeViewBox: false
        }, {
          removeDimensions: true
        }]
      }
    ))
    .pipe(gulp.dest('src/svg'));
});

// // browserSync and file watching
gulp.task('serve', function () {
  browserSync.init({
    server: site,
    browser: 'FireFox Developer Edition'
  });

  gulp.watch("src/stylus/*.styl", gulp.series('stylus'));
  gulp.watch("src/pug/*.pug", gulp.series('pug'));
  gulp.watch("src/images/*.svg", gulp.series('svgo', 'pug'));
  gulp.watch(site + "*.html").on('change', browserSync.reload);
});

gulp.task('default', gulp.series('serve'));
