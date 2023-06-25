export const createVectorChart = () => {
  const option = {
    title: {
      text: 'Tiltmeter Vector',
      left: 'center',
      textStyle: {
        fontWeight: 'normal',
        fontSize: 13,
      },
    },
    xAxis: {
      type: 'value',
      scale: true,
      name: 'Easting (m)',
      nameLocation: 'center',
      nameGap: 30,
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      scale: false,
      name: 'Northing (m)',
      nameLocation: 'center',
      nameGap: 50,
      splitLine: { show: false },
    },
    grid: {
      left: '20%',
    },
    series: [],
  }
  return option
}
