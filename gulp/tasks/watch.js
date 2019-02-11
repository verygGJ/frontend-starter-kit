import gulp from 'gulp';
import watch from 'gulp-watch';
import runSequence from 'run-sequence';
import { reload } from 'browser-sync';
import paths from '../paths';
import options from '../../options';

gulp.task('watch', () => {
  global.watch = true;

  watch(`${paths.src.styles}/**/*.{scss,css}`, () => {
    runSequence('scss', reload.bind(null, `${paths.dist.styles}/index.css`));
  });

  watch(`${paths.src.pngsprite}/*.png`, () => {
    runSequence('png-sprite', reload);
  });

  watch(`${paths.src.svgsprite}/*`, () => {
    runSequence('svg-sprite', reload);
  });

  watch([`${paths.baseSrc}/**/*.${options.templateEngine}`], () => {
    runSequence(`${options.templateEngine}`, reload);
  });

  watch([`${paths.baseSrc}/*.${options.templateEngine}`], { events: ['add', 'unlink'] }, () => {
    runSequence('files-menu', reload);
  });

  watch(`${paths.src.static}/**/*.{png,jpg,gif,svg,mp4,webm,mp3}`, () => {
    runSequence('static', reload);
  });

  watch(`${paths.src.API}/*.json`, () => {
    runSequence('API', reload);
  });

  watch(`${paths.src.fonts}/**/*`, () => {
    runSequence('fonts', reload);
  });

  watch(`${paths.src.images}/**/*.{png,jpg,gif,svg}`, () => {
    runSequence('images', reload);
  });

  watch(`${paths.src.scripts}/**/*.js`, () => {
    runSequence('scripts:compile');
  });
});
