export const mediaQuery = [
  {
    query: {
      maxWidth: 575.98,
    },
    option: {
      title: {
        top: 25,
        textStyle: {
          fontSize: 13,
        },
      },
    },
  },
]

export const createResidualChart = ({ data }) => {
  const option = {
    title: {
      text: 'Tiltmeter Model',
      left: 'center',
      textStyle: {
        fontWeight: 'normal',
        fontSize: 13,
      },
    },
    xAxis: {
      type: 'value',
      scale: true,
      name: 'Radius (m)',
      nameLocation: 'center',
      nameGap: 30,
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      scale: false,
      name: 'Residual',
      nameLocation: 'center',
      nameGap: 50,
      splitLine: { show: false },
    },
    grid: {
      left: '20%',
    },
    series: [
      {
        data: data.map((v) => [v.radius, v.res_total]),
        symbol: 'none',
        type: 'line',
      },
    ],
  }
  return {
    baseOption: option,
    media: mediaQuery,
  }
}
