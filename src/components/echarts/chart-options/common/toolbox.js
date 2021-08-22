export const dataZoomToolbox = {
  title: {
    zoom: 'Area zooming',
    back: 'Restore area zooming',
  },
}

export const dataZoomYToolbox = {
  ...dataZoomToolbox,
  xAxisIndex: 'none',
}

export const dataZoomXToolbox = {
  ...dataZoomToolbox,
  yAxisIndex: 'none',
}

export const restoreToolbox = {
  title: 'Restore',
}

export const saveAsImageToolbox = {
  title: 'Save as image',
  pixelRatio: 5,
}

export const defaultToolbox = {
  feature: {
    dataZoom: dataZoomXToolbox,
    restore: restoreToolbox,
    saveAsImage: saveAsImageToolbox,
  },
}
