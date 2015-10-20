var isDebug = process.env.NODE_ENV !== 'production';

module.exports = {
  entry: './src/index.js',
  output: {
    path: __dirname + '/lib',
    filename: 'index.js',
    library: 'redux-sequence-action',
    libraryTarget: 'commonjs'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      include: /src/,
      loader: 'babel?stage=0&loose=all'
    }]
  },
  debug: isDebug,
  devtool: isDebug ? 'inline-source-map' : false,
  watch: isDebug
};
