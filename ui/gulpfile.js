var gulp = require('gulp');
var jslint = require('gulp-jslint');
	gulp.task('default',function(){
	return gulp.src(['js/controllers/bigChart-ctrl.js'])
        .pipe(jslint({ /* this object represents the JSLint directives being passed down */ }))
        // .pipe(jslint.reporter( 'my-reporter' ))
        .pipe(jslint.reporter('default', errorsOnly))
        .pipe(jslint.reporter('stylish', options));
});