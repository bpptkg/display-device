import { min, max, mean, get } from 'lodash'

const FieldTypes = Object.freeze({
  RAINFALL: 'rainfall',
  RATE: 'rate',
  HUMIDITY: 'humidity',
  TEMPERATURE: 'temperature',
  PRESSURE: 'pressure',
  WIND_DIRECTION: 'wind_direction',
  WIND_SPEED: 'wind_speed',
  BATTERY: 'battery',
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
    name: 'air_humidity',
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
    name: 'wind_direction',
    label: 'Wind direction',
    valueSuffix: '\u00B0',
  },
  {
    type: FieldTypes.WIND_SPEED,
    name: 'wind_speed',
    label: 'Wind speed',
    valueSuffix: 'km/h',
  },
  {
    type: FieldTypes.BATTERY,
    name: 'battery_voltage',
    label: 'Battery',
    valueSuffix: 'V',
  },
]

export const getStatsInfo = (data) => {
  const stats = []

  fields.forEach((field) => {
    const arr = data.map((v) => {
      const i = get(v, field.name)
      return field.name === 'air_pressure'
        ? i * 10 // Convert kPa to hPa.
        : i
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
