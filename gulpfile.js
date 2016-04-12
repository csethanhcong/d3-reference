var gulp = require('gulp');
var del = require('del');
var sass = require('gulp-sass');
var include = require('gulp-include');
var source = require('vinyl-source-stream');
var connect = require('gulp-connect');
var basicAuth = require('basic-auth');
var webpack = require('webpack-stream');

var options = {
    buildDir: 'build'
};

gulp.task('clean', function () {
    return del(options.buildDir);
});

gulp.task('fonts', ['clean'], function () {
    return gulp.src('node_modules/font-awesome/fonts/**.*')
        .pipe(gulp.dest([options.buildDir, 'assets', 'fonts'].join('/')));
});

gulp.task('html', ['clean'], function () {
    return gulp.src('src/index.html')
        .pipe(gulp.dest([options.buildDir].join('/')));
});

gulp.task('css', ['clean'], function () {
    return gulp.src('src/assets/css/[^_]*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest([options.buildDir, 'assets', 'css'].join('/')));
});

gulp.task('libraries-js', ['clean'], function () {
    return gulp.src('src/assets/js/libraries.js')
        .pipe(include())
        .on('error', console.log)
        .pipe(gulp.dest([options.buildDir, 'assets', 'js'].join('/')));
});

gulp.task('application-js', ['clean'], function () {
    return gulp.src('src/assets/js/application.js')
        .pipe(webpack(require('./webpack.config')))
        .pipe(gulp.dest([options.buildDir, 'assets', 'js'].join('/')));
});

gulp.task('default', ['clean', 'html', 'fonts', 'css', 'libraries-js', 'application-js']);

gulp.task('serve', ['default'], function () {
    connect.server({
        root: ['build'],
        port: process.env.PORT || 5000,
        livereload: process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined ? true : false,
        middleware: function (connect) {
            return [
                connect().use(function (req, res, next) {
                    var credentials = basicAuth(req);

                    if (!credentials || credentials.name !== 'd3' || credentials.pass !== 'd3JS.org') {
                        res.statusCode = 401;
                        res.setHeader('WWW-Authenticate', 'Basic realm="example"');
                        res.end('Access denied');
                    } else {
                        next();
                    }
                })
            ];
        }
    });
});
