var gulp         = require('gulp'),
    scss         = require('gulp-sass'),
    browserSync  = require('browser-sync'),
    concat       = require('gulp-concat'),
    uglify       = require('gulp-uglifyjs'),
    cssnano      = require('gulp-cssnano'),
    rename       = require('gulp-rename'), 
    imagemin     = require('gulp-imagemin'),
    pngquant     = require('imagemin-pngquant'),
    autoprefixer = require('gulp-autoprefixer'),
    bower 		 = require('gulp-bower');

gulp.task('scss', function(){
    return gulp.src('app/scss/**/*.scss')
        .pipe(scss())
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'app'
        },
        notify: false
    });
});

gulp.task('scripts', function() {
    return gulp.src([
        'app/libs/jquery/dist/jquery.min.js',
        'app/libs/jquery/dist/owl.carousel.min.js'
        ])
        .pipe(concat('libs.min.js')) 
        .pipe(uglify())
        .pipe(gulp.dest('app/js'));
});

gulp.task('css-libs', ['scss'], function() {
    return gulp.src('app/css/libs.css')
        .pipe(cssnano())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('app/css'));
});

gulp.task('watch', ['browser-sync', 'css-libs', 'scripts'], function() {
    gulp.watch('app/scss/**/*.scss', ['scss']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);
});

gulp.task('img', function() {
    return gulp.src('app/img/**/*')
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('bower', function() {
  return bower();
});

gulp.task('default', ['watch']);