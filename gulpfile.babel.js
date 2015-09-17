import gulp from 'gulp';
import gulpif from 'gulp-if';
import sass from 'gulp-sass';
import rename from 'gulp-rename';
import uglify from 'gulp-uglify';
import minifyCSS from 'gulp-minify-css';
import nodemon from 'gulp-nodemon';
import livereload from 'gulp-livereload';
import del from 'del';
import webpack from 'webpack-stream';

const isProduction = (process.env.NODE_ENV === 'production');

const webpackConfig = {
  output: {
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          optional: ['runtime'],
          stage: 0
        }
      }
    ]
  }
};

gulp.task('clean-script', () => {
  return del([
    './public/js'
  ]);
});

gulp.task('clean-style', () => {
  return del([
    './public/css'
  ]);
});

gulp.task('clean-font', () => {
  return del([
    './public/fonts'
  ]);
});

gulp.task('script', ['clean-script'], () => {
  return gulp.src('components/index.js')
             .pipe(webpack(webpackConfig))
             .pipe(gulpif(isProduction, uglify()))
             .pipe(gulp.dest('public/js'));
});

gulp.task('style', ['clean-style'], () => {
  return gulp.src('styles/index.scss')
             .pipe(sass())
             .pipe(rename('bundle.css'))
             .pipe(gulpif(isProduction, minifyCSS()))
             .pipe(gulp.dest('public/css'));
});

gulp.task('font', ['clean-font'], () => {
  return gulp.src(['node_modules/font-awesome/fonts/*'])
             .pipe(gulp.dest('public/fonts'));
});

gulp.task('watch', () => {
  gulp.watch('components/**/*', ['script']);
  gulp.watch('styles/**/*', ['style']);
});

gulp.task('compile', ['script', 'style', 'font']);

gulp.task('develop', ['compile', 'watch'], () => {
  livereload.listen();
  nodemon({
    script: 'index.js',
    ext: 'html js jsx scss'
  }).on('restart', () => {
    setTimeout(() => livereload.changed(__dirname), 1500);
  });
});

gulp.task('default', [
  'develop'
]);
