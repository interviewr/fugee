const webpack = require('webpack')
const { dir, config, rules, plugins } = require('./base')

const webpackConfig = Object.assign({}, config, {
  mode: 'production',
  stats: true,
  devtool: 'cheap-module-source-map',
  output: {
    filename: 'scripts/[name].[chunkhash:8].js',
    path: dir.build,
    publicPath: `${process.env.URI_PREFIX}/`
  },
  module: {
    rules
  },
  // optimization.minimize - uses terser-webpack-plugin under the hood
  plugins: [
    ...plugins,
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ]
})

module.exports = webpackConfig
