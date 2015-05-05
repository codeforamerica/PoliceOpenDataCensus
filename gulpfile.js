var gulp = require('gulp');
var bower = require('gulp-bower');
var wiredep = require('wiredep').stream;


var config = { 
    bowerDir: './bower_components' 
}





gulp.task('bower', function() {
    gulp.src('./public/views/index.html')
        .pipe(wiredep())
        .pipe(gulp.dest("./out"));
});



gulp.task('default', ['bower']);