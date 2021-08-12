import { min, max, mean } from 'lodash'
import { getSeriesByIndex } from '@/utils/series'
import { SeriesNames } from './index'

const SeriesInfo = [
  { name: SeriesNames.SOIL, field: 'temperature3', dataIndex: 0 },
  { name: SeriesNames.TERMOCOUPLE1, field: 'temperature1', dataIndex: 0 },
  { name: SeriesNames.TERMOCOUPLE2, field: 'temperature2', dataIndex: 0 },
  { name: SeriesNames.CO2_MAX, field: 'co2_max', dataIndex: 1 },
  { name: SeriesNames.CO2_TEMP_MAX, field: 'temperature_max', dataIndex: 1 },
  { name: SeriesNames.CO2_HUMI_MAX, field: 'humidity_max', dataIndex: 1 },
]

export const getStatsInfo = (data) => {
  const stats = []

  SeriesInfo.forEach((series) => {
    const array = getSeriesByIndex(data, series.dataIndex).map(
      (v) => v[series.field]
    )

    stats.push({
      name: series.name,
      min: min(array),
      max: max(array),
      mean: mean(array),
    })
  })
  return stats
}
