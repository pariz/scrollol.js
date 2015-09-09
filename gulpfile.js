var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var stripDebug = require('gulp-strip-debug');
var replace = require('gulp-replace');

gulp.task('default', function() {
  return gulp.src('lib/scrollol.js')
    .pipe(stripDebug())
    .pipe(replace('void 0;','')) // Damn you, stripDebug..
    .pipe(uglify({compress:false,mangle:false,output:{beautify:true,indent_level:2}}))
    .pipe(gulp.dest('dist'))
    .pipe(uglify())
    .pipe(rename({suffix:".min"}))
    .pipe(gulp.dest('dist'));
});
