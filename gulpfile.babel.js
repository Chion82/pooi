import gulp from 'gulp';
import gulpif from 'gulp-if';
import sass from 'gulp-sass';
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

gulp.task('clean', () => {
  return del([
    './public/js',
    './public/css'
  ]);
});

gulp.task('script', ['clean'], () => {
  return gulp.src('components/index.js')
             .pipe(webpack(webpackConfig))
             .pipe(gulpif(isProduction, uglify()))
             .pipe(gulp.dest('public/js'));
});

gulp.task('style', ['clean'], () => {
  return gulp.src('styles/index.scss')
             .pipe(sass())
             .pipe(gulpif(isProduction, minifyCSS()))
             .pipe(gulp.dest('public/css'));
});

gulp.task('watch', () => {
  gulp.watch('components/**/*', ['script']);
  gulp.watch('styles/**/*', ['style']);
})

gulp.task('compile', ['script', 'style']);

gulp.task('develop', ['compile', 'watch'], () => {
  livereload.listen();
  nodemon({
    script: 'index.js',
    ext: 'html js jsx'
  }).on('restart', () => {
    setTimeout(() => livereload.changed(__dirname), 1500);
  });
});

gulp.task('default', [
  'develop'
]);
