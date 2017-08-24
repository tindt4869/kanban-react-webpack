const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const NpmInstallPlugin = require('npm-install-webpack-plugin');
const TARGET = process.env.npm_lifecycle_event;

const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build')
};

const common = {
  entry: {
    app: PATHS.app
  },
  // Add resolve.extensions.
  // '' is needed to allow imports without an extension.
  // Note the .'s before extensions as it will fail to match without!!!
  resolve: {
    extensions: ['.js', '.jsx']
  },
  output: {
    path: PATHS.build,
    filename: 'bundle.js'
  }
};

// Default configuration
if (TARGET === 'start' || !TARGET) {
  module.exports = merge(common, {
    devtool: 'eval-source-map',
    devServer: {
      contentBase: PATHS.build,

      // Enable history API fallback so HTML5 History API based
      // routing works. This is a good default that will come
      // in handy in more complicated setups.
      historyApiFallback: true,
      hot: true,
      inline: true,
      // Display only errors to reduce the amout of output
      stats: 'errors-only',
      // Parse host and port from env so this is easy to customize.
      host: process.env.HOST,
      port: process.env.PORT
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new NpmInstallPlugin({
        save: true //--save
      })
    ],
    module: {
      loaders: [
        {
          test: /\.css$/,
          loaders: ['style-loader', 'css-loader'],
          include: PATHS.app
        },
        {
          test: /\.jsx$/,
          // Enable caching for improved performance during development
          // It use default OS directory by default. If you need more custom,
          // pass a path to it. I.e., babel?cacheDirectory=<path>
          loaders: ['babel?cacheDirectory'],
          // Parse only app files. Without this it will go through entire project
          // In addition to being slow, that will most likely result in an error.
          include: PATHS.app
        }
      ]
    }
  });
}

if (TARGET === 'build') {
  module.exports = merge(common, {});
}
