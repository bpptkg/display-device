import { STATIONS as ALL_STATIONS } from '@/constants/stations'
import { mapFieldColumns } from '@/utils/series'
import _ from 'lodash'
import { defaultToolbox } from '../common/toolbox'
import { DATE_FORMAT, DATETIME_FORMAT } from '@/constants/date'
import { Sampling } from '@/constants/rfap-distance'
import { defaultTooltipFormatter } from '@/utils/echarts/tooltip'
import {
  createLegend,
  SeriesNames,
  colorMap,
  smartIndex,
} from '../rfap-distdir'

// Exclude Kantor BPPTKG station and convert objects to array.
export const STATIONS = _.values(_.omit(ALL_STATIONS, ['monroom']))

export const createSeries = (data) => {
  const seriesOptions = STATIONS.map((station, index) => {
    return {
      areaStyle: {},
      data: mapFieldColumns(data, 'timestamp', [
        'countsta',
        (countsta) => {
          return (
            _.get(countsta, station.id, 0) ||
            _.get(countsta, String(station.id), 0)
          )
        },
      ]),
      itemStyle: {
        color: colorMap[smartIndex(index, STATIONS.length, colorMap.length)],
      },
      name: station.name,
      type: 'bar',
      stack: 'one',
    }
  })

  // Add max. distance plot to the secondary Y axis.
  seriesOptions.push({
    // Convert distance from m to km.
    data: mapFieldColumns(data, 'timestamp', [
      'distance',
      (v) => (v ? v / 1000 : v),
    ]),
    name: SeriesNames.MAX_DISTANCE,
    type: 'scatter',
    symbol: 'circle',
    symbolSize: 7,
    yAxisIndex: 1,
  })

  return seriesOptions
}

export const createYAxis = () => {
  return [
    {
      name: 'RF & AP Count',
      nameGap: 40,
      nameLocation: 'center',
      scale: false,
      splitLine: { show: false },
      type: 'value',
    },
    {
      name: 'Max. Distance (km)',
      nameGap: 40,
      nameLocation: 'center',
      scale: false,
      splitLine: { show: false },
      type: 'value',
    },
  ]
}

export const baseChartOptions = ({
  title = {},
  sampling = Sampling.DAY,
} = {}) => {
  return {
    backgroundColor: '#fff',
    grid: { bottom: 85 },
    legend: createLegend(),
    title: {
      text: 'RF & AP Type',
      left: 'center',
      align: 'right',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
      },
      subtext: '',
      subtextStyle: { color: '#363636' },
      ...title,
    },
    toolbox: defaultToolbox,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        lineStyle: {
          type: 'dashed',
        },
      },
      formatter: defaultTooltipFormatter({
        format: sampling === Sampling.DAY ? DATE_FORMAT : DATETIME_FORMAT,
        valueDecimals: 0,
        noData: '-',
        adaptive: false,
        adaptiveOptions: { columnCount: 2 },
        excludeZero: true,
        seriesProps: {
          [SeriesNames.MAX_DISTANCE]: {
            valueDecimals: 2,
            valueSuffix: ' km',
          },
        },
      }),
    },
    yAxis: createYAxis(),
  }
}
