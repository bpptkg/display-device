;(function (root, factory) {
  // eslint-disable-next-line no-undef
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    // eslint-disable-next-line no-undef
    define(['exports', 'echarts'], factory)
  } else if (
    typeof exports === 'object' &&
    typeof exports.nodeName !== 'string'
  ) {
    // CommonJS
    factory(exports, require('echarts'))
  } else {
    // Browser globals
    factory({}, root.echarts)
  }
})(this, function (exports, echarts) {
  var log = function (msg) {
    if (typeof console !== 'undefined') {
      console && console.error && console.error(msg)
    }
  }
  if (!echarts) {
    log('ECharts is not Loaded')
    return
  }
  // Rainbow.
  var colorPalette = [
    '#96005a',
    '#0000c8',
    '#0019ff',
    '#0098ff',
    '#2cff96',
    '#97ff00',
    '#ffea00',
    '#ff6f00',
    '#ff0000',
  ]
  echarts.registerTheme('flow', {
    color: colorPalette,
    backgroundColor: '#fff',
    graph: {
      color: colorPalette,
    },
  })
})
