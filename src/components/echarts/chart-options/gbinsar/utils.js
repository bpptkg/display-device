import { min, max, mean } from 'lodash'

export const getStatsPointInfo = (data) => {
  const stats = []

  const calculateStats = (variableName, customName) => {
    const variableData = data.map((v) => v[variableName])

    stats.push({
      name: customName,
      min: min(variableData),
      max: max(variableData),
      mean: mean(variableData),
    })
  }

  // Calculate stats for each variable with custom names
  calculateStats('rb1', 'RB1')
  calculateStats('rb2', 'RB2')
  calculateStats('rb3', 'RB3')
  calculateStats('titikstabil', 'T.Stabil')
  calculateStats('kubahlava2021tumbuh', '2021Tumbuh')
  calculateStats('lava92', 'Lava 92')
  calculateStats('lava98', 'Lava 98')

  return stats
}

export const getStatsAreaInfo = (data) => {
  const stats = []

  const calculateStats = (variableName, customName) => {
    const variableData = data.map((v) => v[variableName])

    stats.push({
      name: customName,
      min: min(variableData),
      max: max(variableData),
      mean: mean(variableData),
    })
  }

  // Calculate stats for each variable with custom names
  calculateStats('area1888', 'Area1888')
  calculateStats('atas1888', 'Atas1888')
  calculateStats('tengah1888', 'Tengah1888')
  calculateStats('bawah1888', 'Bawah1888')

  return stats
}
