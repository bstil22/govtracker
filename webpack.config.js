const path = require('path');

module.exports = {
  entry: './src/main.js',
  output: { path: __dirname, filename: 'bundle.js' },
  module: {
    loaders: [
      {
        loader: 'babel',
        include: [path.join(__dirname, 'src')],
        exclude: /node_modules/
      }
    ]
  }
};