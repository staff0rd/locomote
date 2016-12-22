const 
    gulp = require('gulp'), 
    util = require('gulp-util'),
    spawn = require('child_process').spawn, 
    source = require('vinyl-source-stream'),
    browserify = require('browserify'), 
    tsify = require('tsify'),
    tslint= require('gulp-tslint')
  ;

var node;

gulp.task('compile', () => {
  return browserify('src/index.ts', { bundleExternal: false, commondir: false, builtins: false }).plugin(tsify)
    .bundle()
        .on('error', (err) => { util.log(util.colors.red(err.toString()))})
        .pipe(source('server.js'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['server'], function() {
    gulp.watch('src/**/*.ts', ['server']);
});

gulp.task('server', ['lint'], function() {
  if (node) node.kill()
  node = spawn('node', ['dist/server.js'], {stdio: 'inherit'})
  node.on('close', function (code) {
    if (code === 8) {
      gulp.log('Error detected, waiting for changes...');
    }
  });
})

gulp.task("lint", ['compile'], () =>
    gulp.src("src/**/*.ts")
        .pipe(tslint({
            formatter: 'tslint-formatter-eslint-style'
        }))
        .pipe(tslint.report({
            emitError: false
        }))
);

process.on('exit', function() {
    if (node) node.kill()
})