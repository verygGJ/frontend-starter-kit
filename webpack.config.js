import webpack from 'webpack';
import paths from './gulp/paths';
import { env } from './options';

const uglifyJS = new webpack.optimize.UglifyJsPlugin({
  compress: {
    warnings: false,
    comparisons: false
  },
  mangle: {
    safari10: true
  },
  output: {
    comments: false,
    ascii_only: true
  },
  sourceMap: env == 'dev'
});

export default {
  entry: [
    'element.prototype.matches',
    'element-closest',
    'nodelist-foreach-polyfill',
    `${paths.src.scripts}/index.js`
  ],
  output: {
    path: `${__dirname}/dist/js/`,
    filename: 'app.js'
  },
  devtool: 'cheap-module-source-map',
  resolve: {
    modules: ['node_modules'],
    extensions: ['.web.js', '.mjs', '.js', '.json', '.web.jsx', '.jsx']
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: require.resolve('babel-loader'),
      query: {
        presets: ['es2015', 'react']
      }
    }]
  },
  plugins: env !== 'dev' ? [uglifyJS] : [
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      jquery: 'jquery',
      'window.jquery': 'jquery',
      $: 'jquery',
      'window.$': 'jquery'
    })
  ],
  performance: {
    hints: false
  }
}
