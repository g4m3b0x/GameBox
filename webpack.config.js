const path = require('path')

module.exports = {
  entry: './client/index.js',
  output: {
    path: path.join(__dirname, '/public'),
    filename: 'bundle.js'
  },
  // mode: 'development',
  // devtool: 'source-map',
  // module: {
  //   rules: [{
  //     test: /jsx?$/,
  //     exclude: /(node_modules|bower_components)/,
  //     use: ['babel-loader']
  //   }]
  // }
}