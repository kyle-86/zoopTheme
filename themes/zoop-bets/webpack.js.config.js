const path = require('path');
const glob = require('glob');

module.exports = {
  mode: 'development',
  entry: {
    scripts: [
      './assets/js/scripts.js',
      ...glob.sync('./inc/acf-blocks/**/*.js').map(file => path.resolve(__dirname, file)),
    ]
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      // Add rules for handling JavaScript files here
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            // Add any Babel options here if needed
          },
        },
      },
    ],
  },
  resolve: {
    alias: {
      // Add any necessary aliases here
    },
  },
};
