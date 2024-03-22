const path = require('path')
const webpack = require('webpack')

const appVersion = require('./package.json').version

const commitHash = require('child_process')
  .execSync('git rev-parse HEAD')
  .toString()

const buildDate = new Date()

module.exports = {
  publicPath:
    process.env.NODE_ENV === 'production'
      ? process.env.VUE_APP_PUBLIC_PATH || '/display-device/'
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
  pwa: {
    name: 'Davis',
    themeColor: '#fff',
    msTileColor: '#000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    iconPaths: {
      faviconSVG: 'img/icons/favicon.svg',
      favicon32: 'img/icons/favicon-32x32.png',
      favicon16: 'img/icons/favicon-16x16.png',
      appleTouchIcon: 'img/icons/apple-touch-icon-152x152.png',
      maskIcon: 'img/icons/safari-pinned-tab.svg',
      msTileImage: 'img/icons/ms-icon-144x144.png',
    },
  },
}
