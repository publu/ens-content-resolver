/* webpack.config.js */

var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var path = require('path');

module.exports = {
  // Tell Webpack which file kicks off our app.
  entry: path.resolve(__dirname, 'src/js/background.js'),
  // Tell Weback to output our bundle to ./dist/bundle.js
  output: {
    filename: 'background.js',
    path: path.resolve(__dirname, 'dist/js')
  },
  // Tell Webpack which directories to look in to resolve import statements.
  // Normally Webpack will look in node_modules by default but since we’re overriding
  // the property we’ll need to tell it to look there in addition to the
  // bower_components folder.
  resolve: {
    modules: [
      path.resolve(__dirname, 'node_modules')
    ]
  },
};