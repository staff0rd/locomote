
var gulp = require('gulp'),
    util = require('gulp-util'),
    run = require('run-sequence'),
    connect = require('gulp-connect'),
    browserify = require('browserify'),
    tsify = require('tsify'),
    source = require('vinyl-source-stream'),
    batch = require('gulp-batch'),
    tslint = require("gulp-tslint");

gulp.task('watch', (done) => {
    gulp.watch('./src/*.ts', batch(function(events, cb) {
        events.on('data', (data) => { 
            util.log(util.colors.yellow(data.path + " " + data.type + "."));
        }).on('end', function() { run('lint', 'serve-reload', cb)});
    }));
    done();
});

gulp.task("lint", ['compile'], () =>
    gulp.src("src/**/*.ts")
        .pipe(tslint({
            formatter: 'tslint-formatter-eslint-style'
        }))
        .pipe(tslint.report({
            emitError: false
        }))
);

gulp.task('serve-connect', (done) => {
    connect.server({
        root: './src',
        port: 9000,
        host: '0.0.0.0',
        livereload: true
    });
    done();
});

gulp.task('serve-reload', (done) => {
    gulp.src('src/index.html')
        .pipe(connect.reload())
        .on('error', util.log);
    done();
});

gulp.task('compile', () => {
    return browserify({entries: './src/bootstrap.ts'}).plugin(tsify)
    .bundle()
    .on('error', (err) => util.log(util.colors.red(err.toString())))
    .pipe(source('client.js'))
    .pipe(gulp.dest('./src/js'))
});

gulp.task('default', (done) => {
    run('lint', ['serve-connect', 'watch'], done);
});