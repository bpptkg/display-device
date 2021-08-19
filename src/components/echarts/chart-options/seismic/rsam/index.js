import { makeIndex } from '@/utils/series'
import { createRowGrid } from '@/utils/echarts/grid'
import { defaultToolbox } from '../../common/toolbox'
import { defaultTooltipFormatter } from '@/utils/echarts/tooltip'
import { scaledFormatter } from '@/utils/formatter'

export const BANDS = [
  { band: 0, name: 'band0', freq: 'all' },
  { band: 1, name: 'band1', freq: '0.5-2.5' },
  { band: 2, name: 'band2', freq: '2.5-4.5' },
  { band: 3, name: 'band3', freq: '4.5-6.5' },
  { band: 4, name: 'band4', freq: '6.5-8.5' },
  { band: 5, name: 'band5', freq: '8.5-10.5' },
  { band: 6, name: 'band6', freq: '10.5-12.5' },
  { band: 7, name: 'band7', freq: '12.5-14.5' },
  { band: 8, name: 'band8', freq: '14.5-16.5' },
  { band: 9, name: 'band9', freq: '16.5-18.5' },
  { band: 10, name: 'band10', freq: '18.5-20.5' },
  { band: 11, name: 'band11', freq: '20.5-22.5' },
  { band: 12, name: 'band12', freq: '22.5-24.5' },
  { band: 13, name: 'band13', freq: '24.5-26.5' },
]

/**
 * Simple fuzzy label formatter.
 */
function axisLabelFormatter(value) {
  return scaledFormatter(['', 'k', 'M', 'G'])(value)
}

function getBand1() {
  return BANDS.filter((band) => band.band <= 7)
}

function getBand2() {
  return BANDS.filter((band) => band.band > 7)
}

export const BANDS1 = getBand1()
export const BANDS2 = getBand2()

export const createSeries = (
  rsamBands,
  { annotations = [], bands = BANDS } = {}
) => {
  const bandNames = bands.map((v) => v.name)

  return bandNames
    .map((band, index) => {
      return [
        {
          data: rsamBands[band] || [],
          markLine: {
            symbol: 'none',
            data: annotations,
            animation: false,
          },
          name: `Band ${index}`,
          type: 'line',
          symbol: 'none',
          xAxisIndex: index,
          yAxisIndex: index * 2, // Sequence formula to match yAxis index.
        },
        {
          data: rsamBands[`c${band}`] || [],
          name: `Cum. Band ${index}`,
          symbol: 'none',
          type: 'line',
          xAxisIndex: index,
          yAxisIndex: index * 2 + 1, // Sequence formula to match yAxis index.
        },
      ]
    })
    .flat(1)
}

export const createXAxis = (nrows, min, max) => {
  const axis = []
  const indices = makeIndex(nrows)

  indices.forEach((index) => {
    if (index === nrows - 1) {
      axis.push({
        axisTick: { alignWithLabel: true },
        boundaryGap: true,
        gridIndex: index,
        min,
        max,
        splitLine: { show: false },
        type: 'time',
      })
    } else {
      axis.push({
        axisLabel: { show: false },
        axisTick: { show: false },
        gridIndex: index,
        min,
        max,
        splitLine: { show: false },
        type: 'time',
      })
    }
  })
  return axis
}

const bandsMapping = Object.assign({}, BANDS)

export const buildYAxisName = (index) => {
  const name = bandsMapping[index]
  const freq = index === 0 ? 'all' : `${name.freq} Hz`
  return `Band ${index} (${freq})`
}

export const createYAxis = (bands) => {
  return bands
    .map((band, index) => {
      return [
        {
          axisTick: { interval: 2 },
          axisLabel: { formatter: axisLabelFormatter },
          gridIndex: index,
          interval: 'auto',
          name: buildYAxisName(band.band),
          nameGap: 5,
          nameTextStyle: { align: 'left', fontSize: 11 },
          nameLocation: 'end',
          scale: false,
          splitLine: { show: false },
          splitNumber: 4,
          type: 'value',
        },
        {
          axisLabel: { formatter: axisLabelFormatter },
          name: `Cum. Band ${band.band}`,
          nameTextStyle: { align: 'right', fontSize: 11 },
          gridIndex: index,
          position: 'right',
          nameGap: 5,
          interval: 'auto',
          scale: false,
          splitLine: { show: false },
          type: 'value',
        },
      ]
    })
    .flat(1)
}

export const mediaQuery = ({ bands = BANDS } = {}) => {
  return [
    {
      query: {
        maxWidth: 575.98,
      },
      option: {
        grid: createRowGrid(bands.length, {
          bottom: 8,
          margin: 1.3,
          top: 8,
          left: 12,
        }),
        title: {
          top: 25,
        },
      },
    },
  ]
}

export const baseChartOptions = ({
  bands = BANDS,
  title = 'RSAM',
  subtext = '',
} = {}) => {
  return {
    backgroundColor: '#fff',
    dataZoom: [
      {
        type: 'slider',
        xAxisIndex: makeIndex(bands.length),
        realtime: false,
      },
    ],
    grid: createRowGrid(bands.length, { bottom: 8, margin: 1.3, top: 7 }),
    title: {
      text: title,
      left: 'center',
      align: 'right',
      subtext: subtext,
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
      },
      subtextStyle: {
        color: '#363636',
      },
    },
    xAxis: createXAxis(bands.length),
    yAxis: createYAxis(bands),
    toolbox: defaultToolbox,
    tooltip: {
      trigger: 'axis',
      formatter: defaultTooltipFormatter({
        format: 'YYYY-MM-DD HH:mm:ss',
        valueDecimals: 2,
        valueSuffix: ' AU',
      }),
    },
  }
}
