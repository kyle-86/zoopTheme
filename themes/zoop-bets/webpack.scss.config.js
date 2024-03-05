const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const globImporter = require('node-sass-glob-importer');

module.exports = {
  mode: 'development',
  entry: {
    styles: [
      './assets/scss/bootstrap-custom.scss',
    ],
  },
  output: {
    filename: '[name].css',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                importer: globImporter()
              }
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].bundle.css',
      ignoreOrder: true,
    }),
  ],
  resolve: {
    alias: {
      // Add any necessary aliases here
    },
  },
};
