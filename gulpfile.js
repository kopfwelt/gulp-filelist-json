'use strict';
var gulp = require('gulp');
var filelist = require('./index');

gulp.task('default', function () {
    gulp.src('test/fixtures/**/*.html', {
            read: false
        })
        .pipe(filelist({
        	compact: false,
        	filename: 'pages.json',
        	verbose: true
        }))
        .pipe(gulp.dest('./reports/'));
});
