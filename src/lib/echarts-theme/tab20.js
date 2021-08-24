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
  // Tab20.
  var colorPalette = [
    '#1f77b4',
    '#aec7e8',
    '#ff7f0e',
    '#ffbb78',
    '#2ca02c',
    '#98df8a',
    '#d62728',
    '#ff9896',
    '#9467bd',
    '#c5b0d5',
    '#8c564b',
    '#c49c94',
    '#e377c2',
    '#f7b6d2',
    '#7f7f7f',
    '#c7c7c7',
    '#bcbd22',
    '#dbdb8d',
    '#17becf',
    '#9edae5',
  ]
  echarts.registerTheme('tab20', {
    color: colorPalette,
    backgroundColor: '#fff',
    graph: {
      color: colorPalette,
    },
  })
})
