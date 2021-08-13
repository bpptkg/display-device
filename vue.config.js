const path = require('path')
const webpack = require('webpack')

const appVersion = require('./package.json').version

const commitHash = require('child_process')
  .execSync('git rev-parse --short HEAD')
  .toString()

const buildDate = new Date()

module.exports = {
  publicPath:
    process.env.NODE_ENV === 'production'
      ? '/display-device/'
      : process.env.NODE_ENV === 'staging'
      ? '/display-device-dev/'
      : '/',
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve('src'),
      },
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          DD_APP_VERSION: JSON.stringify(appVersion),
          DD_COMMIT_HASH: JSON.stringify(commitHash),
          DD_BUILD_DATE: JSON.stringify(buildDate.toISOString()),
        },
      }),
    ],
  },
}
