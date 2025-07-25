import { EnergyTypes } from '@/constants/energy'

export default [
  {
    value: EnergyTypes.TOTAL,
    text: 'VTA+VTB+MP',
    chartTitle: 'Total Seismic Energy',
  },
  {
    value: EnergyTypes.VT,
    text: 'VTA+VTB',
    chartTitle: 'Seismic Energy (VTA+VTB)',
  },
  {
    value: EnergyTypes.VTA,
    text: 'VTA',
    chartTitle: 'Seismic Energy (VTA)',
  },
  {
    value: EnergyTypes.VTB,
    text: 'VTB',
    chartTitle: 'Seismic Energy (VTB)',
  },
  {
    value: EnergyTypes.VTBMP,
    text: 'VTB+MP',
    chartTitle: 'Seismic Energy (VTB+MP)',
  },
]
