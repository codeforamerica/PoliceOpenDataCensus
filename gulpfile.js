var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var prepBower = require('bower-files');
var inject = require('gulp-inject');
var series = require('stream-series');
var del = require('del');
var bower = require('gulp-bower');

gulp.task('default', ["bower", "clean", "buildDev"]);


gulp.task('bower', function() {
    return bower().pipe(gulp.dest('bower_components/'))
});


gulp.task('clean', function() {
    return del.sync(['out/']);
});

gulp.task('buildDev', ['bower'], function() {
    var lib = prepBower();

    var target = gulp.src('./public/index.html');

    var bowerJs = gulp.src(lib.ext('js').files)
        .pipe(gulp.dest('out/js'));

    var bowerCss = gulp.src(lib.ext('css').files)
        .pipe(gulp.dest('out/css'));

    var bowerWoff = gulp.src(lib.ext('woff').files)
        .pipe(gulp.dest('out/fonts'));

    var customJs = gulp.src('./public/js/**.js')
        .pipe(gulp.dest('out/js'));

    var customCss = gulp.src('.public/css/**.css')
        .pipe(gulp.dest('out/css'));

    target.pipe(inject(series(bowerJs, customJs), {
            ignorePath: '/out/'
        }))
        .pipe(inject(series(bowerCss, customCss), {
            ignorePath: '/out/'
        }))
        .pipe(gulp.dest('out/'));
});



// gulp.task('publish', function() {
//     gulp.src(lib.ext('js').files)
//         .pipe(concat('lib.min.js'))
//         .pipe(uglify())
//         .pipe(gulp.dest('public/js'));

//     gulp.src(lib.ext('css').files)
//         .pipe(concat('lib.min.css'))
//         .pipe(gulp.dest('public/css'));

//     gulp.src(lib.ext('woff').files)
//         .pipe(gulp.dest('public/fonts'));

// });