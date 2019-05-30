"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var csso = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
var svgstore = require("gulp-svgstore");
var posthtml = require("gulp-posthtml");
var htmlmin = require("gulp-htmlmin");
var include = require("posthtml-include");
var uglify = require('gulp-uglify');
var del = require("del");
var server = require("browser-sync").create();

gulp.task("copy", function() {
return gulp.src([
"source/fonts/**/*.{woff,woff2}"
], {
base: "source"
})
.pipe(gulp.dest("build"));
})

gulp.task("clean", function() {
return del("build");
})

gulp.task("css", function () {
return gulp.src("source/sass/style.scss")
.pipe(plumber())
.pipe(sourcemap.init())
.pipe(sass())
.pipe(postcss([
autoprefixer()
]))
.pipe(csso())
.pipe(rename("style.min.css"))
.pipe(sourcemap.write("."))
.pipe(gulp.dest("build/css"))
.pipe(server.stream());
});

gulp.task("images", function() {
return gulp.src("source/img/**/*.{png,jpg,svg}")
.pipe(imagemin([
imagemin.optipng({optimizationLevel: 3}),
imagemin.jpegtran({progressive: true}),
imagemin.svgo()
]))

.pipe(gulp.dest("build/img"));
})

gulp.task("webp", function() {
return gulp.src("source/img/**/*.{png,jpg}")
.pipe(webp({quality: 90}))
.pipe(gulp.dest("build/img"));
})

gulp.task("sprite", function() {
return gulp.src("source/img/sprite/*.svg")
.pipe(svgstore({
inlineSvg: true
}))
.pipe(rename("sprite.svg"))
.pipe(gulp.dest("build/img"));
})

gulp.task("html", function() {
return gulp.src("source/*.html")
.pipe(posthtml([
include()
]))
.pipe(htmlmin({ collapseWhitespace: true }))
.pipe(gulp.dest("build"));
})

gulp.task('js', function () {
return gulp.src("source/js/*.js")
.pipe(uglify())
.pipe(gulp.dest("build/js"));
});

gulp.task("refresh", function(done) {
server.reload();
done();
})

gulp.task("build", gulp.series(
"clean",
"copy",
"css",
"sprite",
"html",
"js",
"images",
"webp"
));

gulp.task("server", function () {
server.init({
server: "build/",
notify: false,
open: true,
cors: true,
ui: false
});

gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css"));
gulp.watch("source/img/icon-*.svg", gulp.series("sprite", "html", "refresh"));
gulp.watch("source/*.html", gulp.series("html", "refresh"));
});

gulp.task("start", gulp.series("build", "server"));
