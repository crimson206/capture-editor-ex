const path = require('path');

/** @type {import('webpack').Configuration} */
const webviewConfig = {
  target: 'web',
  mode: 'development',
  entry: path.resolve(__dirname, 'script.ts'),
  output: {
    path: path.resolve(__dirname, '../webview-dist'),
    filename: 'script.js',
    // devtoolModuleFilenameTemplate: '[resource-path]'
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: path.resolve(__dirname, './tsconfig.json')
            }
          }
        ]
      }
    ]
  }
};

module.exports = webviewConfig;