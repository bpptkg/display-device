export const INTERVAL = 10 /* 10 minutes interval */
export const FACTOR = 6 /* Hourly rate constant over 10 minutes interval */

export const FIELDS = Object.freeze({
  TIMESTAMP: 'timestamp',
  WIND_DIRECTION: 'wind_direction',
  WIND_SPEED: 'wind_speed',
  AIR_TEMPERATURE: 'air_temperature',
  AIR_HUMIDITY: 'air_humidity',
  AIR_PRESSURE: 'air_pressure',
  RAINFALL: 'rainfall',
  AMOUNT: 'amount',
  BATTERY_VOLTAGE: 'battery_voltage',
  POWER_TEMPERATURE: 'power_temperature',
})

export const HPA_TO_MMHG = 1 / 1.33322387415
