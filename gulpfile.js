/* gulpfile.js */
var gulp        = require('gulp'),
    sass        = require('gulp-sass'),
    browserSync = require('browser-sync'),
    plumber     = require('gulp-plumber'),
    prefix      = require('gulp-autoprefixer');

// source and distribution folder
var source = 'src/',
    dest = 'dist/';

// Bootstrap scss source
var bootstrapSass = {
        in: './node_modules/bootstrap-sass/'
    };
    
// fonts
var fonts = {
        in: [source + 'fonts/*.*', bootstrapSass.in + 'assets/fonts/**/*'],
        out: dest + 'fonts/'
    };

// css source file: .scss files
var scss = {
    in: source + 'scss/main.scss',
    out: dest + 'css/',
    watch: source + 'scss/**/*',
    sassOpts: {
        outputStyle: 'nested',
        precison: 3,
        errLogToConsole: true,
        includePaths: [bootstrapSass.in + 'assets/stylesheets']
    }
};

// Spin up a server
gulp.task('browserSync', function() {
    browserSync({
        server: {
            baseDir: 'dist',
            online: false
        }
    })
});

// copy bootstrap required fonts to dest
gulp.task('fonts', function () {
    return gulp
        .src(fonts.in)
        .pipe(gulp.dest(fonts.out));
});

// compile scss
gulp.task('sass', ['fonts'], function () {
    return gulp.src(scss.in)
        .pipe(plumber())
        .pipe(sass(scss.sassOpts))
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gulp.dest(scss.out))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// default task
gulp.task('default', ['watch']);

// Live reload anytime a file changes
gulp.task('watch', ['browserSync', 'sass'], function() {
    gulp.watch('src/scss/*.scss', ['sass']);
    gulp.watch('dist/*.html').on('change', browserSync.reload);
});