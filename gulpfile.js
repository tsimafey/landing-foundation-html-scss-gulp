const gulp = require('gulp');

const imagemin = require('gulp-imagemin')
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');

const server = require('browser-sync').create();

function imageMinify() {
    return gulp.src('src/assets/images/*.{gif,png,jpg,svg,webp}')
        .pipe(imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({
            quality: 75,
            progressive: true
        }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
            plugins: [
            { removeViewBox: true },
            { cleanupIDs: false }
            ]
        })
        ]))
        .pipe(gulp.dest('dist/img'))
}

function styles() {
    return gulp.src('src/sass/**/*.scss')
      .pipe(sass())
      .pipe(autoprefixer({
        cascade: false
      }))
      .pipe(cleanCSS({
        debug: true,
        compatibility: '*'
      }, details => {
        console.log(`${details.name}: Original size:${details.stats.originalSize} - Minified size: ${details.stats.minifiedSize}`)
      }))
      .pipe(rename({ suffix: '.min' }))
      .pipe(gulp.dest('dist/css'))
}

exports.default = function serve(cb) {
    server.init({
        server: 'dist',
        notify: false,
    })

    gulp.watch('src/assets/images/**/*.{gif,png,jpg,svg,webp}', gulp.series(imageMinify)).on('change', server.reload)
    gulp.watch('src/sass/**/*.scss', gulp.series(styles, cb => gulp.src('dist/css').pipe(server.stream()).on('end', cb)))
    gulp.watch('dist/*.html').on('change', server.reload)
}