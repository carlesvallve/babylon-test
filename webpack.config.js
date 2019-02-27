const path = require('path');

module.exports = {
  resolve: {
      extensions: ['.ts', '.js']
  },
  module: {
      rules: [{
          test: /\.tsx?$/,
          loader: 'ts-loader'
      }]
  },
  entry: './src/index.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build/')
  },
}