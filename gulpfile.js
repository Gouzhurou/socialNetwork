import gulp from 'gulp'
import less from 'gulp-less'
import babel from 'gulp-babel'
import {deleteAsync} from 'del'

gulp.task('clean_js', () => {
    return deleteAsync('./public/js/*.js');
});

gulp.task('make_js', () => {
    return gulp.src('./public/raw-js/*.js')
        .pipe(babel())
        .pipe(gulp.dest('./public/js/'));
});

gulp.task('clean_css', () => {
    return deleteAsync('./public/css/*.css');
});

gulp.task('make_css', () => {
    return gulp.src('./public/less/*.less')
        .pipe(less())
        .pipe(gulp.dest('./public/css/'));
});

gulp.task("default", gulp.parallel((gulp.series('clean_js', 'make_js')), (gulp.series('clean_css', 'make_css'))));