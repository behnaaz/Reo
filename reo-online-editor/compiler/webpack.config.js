const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: './index.js',
  output: {
    filename: 'ReoInterpreter.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'ReoInterpreter'
  },
  node: {module: "empty", net: "empty", fs: "empty"},
  optimization: {
    minimizer: [
      new UglifyJSPlugin({
        uglifyOptions: {
          compress: {
            drop_console: true,
          }
        }
      })
    ]
  }
};
