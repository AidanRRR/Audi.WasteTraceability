var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    imagemin = require('gulp-imagemin'),
    del = require('del');

//default function
gulp.task('default', ['watch']);
gulp.task('build', [
  'moveFonts',
  'compileHtml',
  'compileVendorJs',
  'compileAppJs',
  'compileSass',
  'optimizeImages'
]);

//remove app folder on build start, let's start fresh
gulp.task('clean', function() {
  return del(['app/**/**/**']);
});

//watch files for changes
gulp.task('watch', function () {
  gulp.watch(['dev/app.module.js', 'dev/app.config.js', 'dev/*/*.js'], ['compileAppJs']);
  gulp.watch('dev/assets/sass/**/*.scss', ['compileSass']);
  gulp.watch(['dev/**/*.html', 'dev/*.html'], ['moveHtml']);
});

//move fontawesome fonts to app folder
gulp.task('moveFonts', function() {
  gulp.src(['dev/assets/fonts/*', 'bower_components/font-awesome/fonts/*'])
    .pipe(gulp.dest('app/assets/fonts'));
});

gulp.task('compileHtml', function() {
  gulp.src(['dev/**/*.html', 'dev/*.html'])
    .pipe(gulp.dest('app'));
});

//move html files to app folder
gulp.task('moveHtml', function() {
  gulp.src(['dev/**/*.html', 'dev/*.html'])
    .pipe(gulp.dest('app'));
});

//optimize images in images folder
gulp.task('optimizeImages', function() {
  gulp.src('dev/assets/img/**/*')
    .pipe(imagemin({
        progressive: true
    }))
    .pipe(gulp.dest('app/assets/img'));
});

//compile sass
gulp.task('compileSass', function () {
  gulp.src(['dev/assets/sass/config.scss'])
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(gulp.dest('app/assets/css'));
});

//concat and minify vendor specific javascript files
gulp.task('compileVendorJs', function () {
   gulp.src([
        'bower_components/jquery/dist/jquery.min.js',
        'bower_components/angular/angular.min.js',
        'bower_components/angular-route/angular-route.min.js',
        'bower_components/angular-animate/angular-animate.min.js',
        'bower_components/datatables.net/js/jquery.dataTables.min.js',
        'bower_components/angular-datatables/dist/angular-datatables.min.js',
        'bower_components/angularjs-datepicker/dist/angular-datepicker.min.js',
        'bower_components/ng-dialog/js/ngDialog.min.js',
        'bower_components/angular-sanitize/angular-sanitize.min.js',
        'bower_components/ng-csv/build/ng-csv.min.js',
        'dev/assets/js/qr-generator.js',
        'bower_components/angular-qrcode/angular-qrcode.js',
        'bower_components/moment/min/moment-with-locales.min.js'
      ])
      .pipe(concat('plugins.min.js'))
      .pipe(gulp.dest('app/assets/js'))
      .pipe(uglify())
      .pipe(gulp.dest('app/assets/js'));
});

//minify main.js file
gulp.task('compileAppJs', function(){
  gulp.src(['!dev/assets/*', 'dev/app.module.js', 'dev/app.config.js', 'dev/*/*.js'])
    .pipe(concat('app.min.js'))
    .pipe(gulp.dest('app/assets/js'))
    .pipe(uglify().on('error', err))
    .pipe(gulp.dest('app/assets/js'));
});

function err(error){
  console.log(error.toString());
}
