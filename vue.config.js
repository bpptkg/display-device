const path = require('path')
const webpack = require('webpack')

const commitHash = require('child_process')
  .execSync('git rev-parse --short HEAD')
  .toString()

const buildDate = new Date()

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve('src'),
      },
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          DD_APP_VERSION: JSON.stringify('1.7.2'),
          DD_COMMIT_HASH: JSON.stringify(commitHash),
          DD_BUILD_DATE: JSON.stringify(buildDate.toISOString()),
        },
      }),
    ],
  },
}
