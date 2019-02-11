export default {
  baseSrc: './app',
  baseDist: './dist',
  src: {
    styles: './app/scss',
    pngsprite: './app/png-sprite',
    svgsprite: './app/svg-sprite',
    images: './app/images',
    svg: './app/svg',
    scripts: './app/scripts',
    static: './app/data',
    includes: './app/_includes',
    fonts: './app/fonts',
    API: './app/API'
  },
  dist: {
    styles: './dist/css',
    images: './dist/images',
    scripts: './dist/js',
    static: './dist/data',
    fonts: './dist/fonts',
    API: './dist/API'
  },
  inline: {
    styles: '/css',
    images: '/images'
  }
};