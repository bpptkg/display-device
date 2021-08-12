export function renderItem(params, api) {
  const xValue = api.value(0)
  const highPoint = api.coord([xValue, api.value(1)])
  const lowPoint = api.coord([xValue, api.value(2)])
  const halfWidth = 3
  const style = api.style({
    stroke: api.visual('color'),
    fill: null,
  })

  return {
    type: 'group',
    children: [
      {
        type: 'line',
        shape: {
          x1: highPoint[0] - halfWidth,
          y1: highPoint[1],
          x2: highPoint[0] + halfWidth,
          y2: highPoint[1],
        },
        style: style,
      },
      {
        type: 'line',
        shape: {
          x1: highPoint[0],
          y1: highPoint[1],
          x2: lowPoint[0],
          y2: lowPoint[1],
        },
        style: style,
      },
      {
        type: 'line',
        shape: {
          x1: lowPoint[0] - halfWidth,
          y1: lowPoint[1],
          x2: lowPoint[0] + halfWidth,
          y2: lowPoint[1],
        },
        style: style,
      },
    ],
  }
}
