import { linspace } from '@/utils/linspace'
import { THEMES } from '@/components/echarts/chart-options/hypocenter'

/**
 * Inject ECharts visual map magnitude scale for hypocenter chart options.
 *
 * @param {Array} options Visual map options.
 * @param {Object} settings Optional settings.
 *
 * @returns {Object} Injected visual map options.
 */
export const injectMagnitudeScale = (
  options,
  {
    showMagnitudeLegend = false,
    minSymbolSize = 5,
    maxSymbolSize = 15,
    theme = 'light',
  } = {}
) => {
  // Quick check if piecewise or customPieceWise already set.
  const piecewiseExists = options.some(
    (v) => v.type === 'piecewise' || v.type === 'customPiecewise'
  )
  if (piecewiseExists) {
    return options
  }

  const NUM_CATEGORIES = 4
  const symbolSizeRange = linspace(minSymbolSize, maxSymbolSize, NUM_CATEGORIES)

  return [
    ...options,
    {
      dimension: 4,
      itemGap: 15,
      maxOpen: true,
      pieces: [
        {
          min: 0,
          max: 1,
          symbolSize: symbolSizeRange[0],
          extendedProps: {
            itemWidth: symbolSizeRange[0],
            itemHeight: symbolSizeRange[0],
            itemSymbol: 'circle',
          },
        },
        {
          min: 1,
          max: 2,
          symbolSize: symbolSizeRange[1],
          extendedProps: {
            itemWidth: symbolSizeRange[1],
            itemHeight: symbolSizeRange[1],
            itemSymbol: 'circle',
          },
        },
        {
          min: 3,
          max: 4,
          symbolSize: symbolSizeRange[2],
          extendedProps: {
            itemWidth: symbolSizeRange[2],
            itemHeight: symbolSizeRange[2],
            itemSymbol: 'circle',
          },
        },
        {
          min: 4,
          symbolSize: symbolSizeRange[4],
          extendedProps: {
            itemWidth: symbolSizeRange[3],
            itemHeight: symbolSizeRange[3],
            itemSymbol: 'circle',
          },
        },
      ],
      orient: 'vertical',
      right: 0,
      seriesIndex: 0,
      show: showMagnitudeLegend,
      showLabel: true,
      text: ['Magnitude', ''],
      textStyle: {
        color: theme === THEMES.dark ? '#fff' : '#000',
        fontSize: 10,
      },
      // Our home made custom piecewise visual map. See extension code at
      // @/lib/echarts-extension/custom-visualmap.
      type: 'customPiecewise',
    },
  ]
}
