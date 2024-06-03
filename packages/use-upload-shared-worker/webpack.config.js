const path = require('node:path');

module.exports = {
  mode: 'production',
  entry: {
    main: './src/index.ts',
    'file-reader': './src/file-reader/file-reader.worker.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    library: {
      type: 'module',
    },
    module: true,
    clean: true
  },
  experiments: {
    outputModule: true
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: 'ts-loader'
      },
    ]
  }
};
