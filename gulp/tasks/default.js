import gulp from 'gulp';
import runSequence from 'run-sequence';
import options from '../../options';
 
gulp.task('default', () => {
  runSequence(
    [
      'png-sprite',
      'svg-sprite',
      'fonts',
      `${options.templateEngine}`,
      'files-menu',
      'scss',
      'scripts:compile',
      'images',
      'static',
      'API'
    ],
    'livereload',
    'watch'
  );
});
