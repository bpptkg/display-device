import { min, max, mean, get } from 'lodash'

const FieldTypes = Object.freeze({
  RAINFALL: 'rainfall',
  RATE: 'rate',
  HUMIDITY: 'humidity',
  TEMPERATURE: 'temperature',
  PRESSURE: 'pressure',
  WIND_DIRECTION: 'wind_direction',
  WIND_SPEED: 'wind_speed',
  SUPPLY_VOLTAGE: 'supply_voltage',
})

const fields = [
  {
    type: FieldTypes.RAINFALL,
    name: 'cumulative_rainfall',
    label: 'Rainfall',
    valueSuffix: 'mm',
  },
  {
    type: FieldTypes.RATE,
    name: 'rate',
    label: 'Rate',
    valueSuffix: 'mm/h',
  },
  {
    type: FieldTypes.HUMIDITY,
    name: 'relative_humidity',
    label: 'Humidity',
    valueSuffix: '%',
  },
  {
    type: FieldTypes.TEMPERATURE,
    name: 'air_temperature',
    label: 'Temperature',
    valueSuffix: '\u00B0C',
  },
  {
    type: FieldTypes.PRESSURE,
    name: 'air_pressure',
    label: 'Pressure',
    valueSuffix: 'hPa',
  },
  {
    type: FieldTypes.WIND_DIRECTION,
    name: 'wind_direction_avg',
    label: 'Wind direction',
    valueSuffix: '\u00B0',
  },
  {
    type: FieldTypes.WIND_SPEED,
    name: 'wind_speed_avg',
    label: 'Wind speed',
    valueSuffix: 'km/h',
    converterFn: (wind_speed_avg) => wind_speed_avg * 3.6, // m/s to km/h
  },
  {
    type: FieldTypes.SUPPLY_VOLTAGE,
    name: 'supply_voltage',
    label: 'Supply voltage',
    valueSuffix: 'V',
  },
]

export const getStatsInfo = (data) => {
  const stats = []

  fields.forEach((field) => {
    const arr = data.map((v) => {
      const val = get(v, field.name)
      return field.converterFn ? field.converterFn(val) : val
    })
    stats.push({
      type: field.type,
      name: field.name,
      label: field.label,
      valueSuffix: field.valueSuffix,
      min: min(arr),
      max: max(arr),
      mean: mean(arr),
    })
  })

  return stats
}
