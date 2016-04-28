var sources, destinations, lr, gulp, gutil, jade, stylus;

gulp = require('gulp');
jade = require('gulp-jade');
gutil = require('gulp-util');
stylus = require('gulp-stylus');
imagemin = require('gulp-imagemin');
pngquant = require('imagemin-pngquant');

sources = {
  jade: "src/jade/**/*.jade",
  stylus: "src/stylus/**/*.stylus",
  img: "src/img/*.*"
};

destinations = {
  html: "build/",
  css: "build/css",
  img: "build/img"
};

gulp.task("jade", function(event) {
  return gulp.src("src/jade/**/*.jade").pipe(jade({
    pretty: true
  })).pipe(gulp.dest(destinations.html));
});

gulp.task("stylus", function(event) {
  return gulp.src("src/stylus/**/*.stylus").pipe(stylus({
    style: "compressed"
  })).pipe(gulp.dest(destinations.css));
});

gulp.task("watch", function() {
  gulp.watch(sources.jade, ["jade"]);
  gulp.watch(sources.stylus, ["stylus"]);
  gulp.watch(sources.img, ["img"]);
  gulp.watch('build/**/*', refresh);
});

gulp.task('serve', function () {
  var express = require('express');
  var app = express();
  app.use(require('connect-livereload')());
  app.use(express.static(__dirname+'/build/'));
  app.listen(4000);
  lr = require('tiny-lr')();
  lr.listen(35729);
});

gulp.task('img', function () {
  gulp.src(sources.img) //Выберем наши картинки
    .pipe(imagemin({ //Сожмем их
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()],
        interlaced: true
    }))
    .pipe(gulp.dest(destinations.img)) //И бросим в build
});



gulp.task("default", ["jade", "stylus", "watch", "serve"]);

refresh = function(event) {
  var fileName = require('path').relative(__dirname, event.path);
  gutil.log.apply(gutil, [gutil.colors.magenta(fileName), gutil.colors.cyan('built')]);
  lr.changed({
    body: { files: [fileName] }
  });
}