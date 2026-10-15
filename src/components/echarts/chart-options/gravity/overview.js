import moment from 'moment'
import { NO_DATA_NOTATION } from '../../../../constants/stats'
import {
  createCircleTemplate,
  toUnixMiliSeconds,
  makeIndex,
} from '../../../../utils/series'
import { tab20ColorMap } from '../../../../utils/tab20'
import { defaultToolbox } from '../common/toolbox'
import { smartIndex } from '../rfap-distdir'

// Vertical layout (px)
const ROW_HEIGHT = 60
const ROW_MARGIN = 32
const TOP = 80
const AXIS_LABEL_SPACE = 55
const DATAZOOM_HEIGHT = 20
const BOTTOM = 30

// Desktop horizontal layout (% of container width)
const OUTER_MARGIN = 2
const LABEL_SPACE = 6
const COLUMN_GAP = 3

// Mobile horizontal layout (px)
const MOBILE_LEFT = 72
const MOBILE_RIGHT = 16

const computeColumnGeometry = (columnCount) => {
  const slotWidth =
    (100 - 2 * OUTER_MARGIN - COLUMN_GAP * (columnCount - 1)) / columnCount
  return Array.from({ length: columnCount }, (_, i) => {
    const slotLeft = OUTER_MARGIN + i * (slotWidth + COLUMN_GAP)
    return {
      left: slotLeft + LABEL_SPACE,
      width: slotWidth - LABEL_SPACE,
    }
  })
}

const getContentHeight = (groups) => {
  const maxRows = Math.max(0, ...groups.map((g) => g.stations.length))
  if (maxRows === 0) return 0
  return maxRows * ROW_HEIGHT + (maxRows - 1) * ROW_MARGIN
}

const createAxes = (gridIndex, benchmark, showDateLabels, isMobile) => {
  const fontSize = isMobile ? 10 : 12
  return {
    xAxis: {
      gridIndex,
      type: 'time',
      splitLine: { show: false },
      axisLabel: { show: showDateLabels, fontSize },
      axisTick: { show: showDateLabels },
    },
    yAxis: {
      gridIndex,
      type: 'value',
      scale: true,
      name: `${benchmark.sta_fid} (mGal)`,
      nameLocation: 'end',
      nameGap: 10,
      nameTextStyle: { fontSize },
      splitLine: { show: false },
      splitNumber: 2,
      minInterval: 0.01,
      axisLabel: { formatter: (v) => v.toFixed(2), fontSize },
    },
  }
}

// Phones: one full-width column, every station stacked vertically.
// Each filter group ends with its own date axis.
const buildMobileLayout = (groups) => {
  const grid = []
  const xAxis = []
  const yAxis = []
  const order = []
  let cursor = TOP

  groups.forEach((group) => {
    const count = group.stations.length
    group.stations.forEach((benchmark, rowIndex) => {
      const isLastInGroup = rowIndex === count - 1
      const axes = createAxes(order.length, benchmark, isLastInGroup, true)

      grid.push({
        top: cursor,
        height: ROW_HEIGHT,
        left: MOBILE_LEFT,
        right: MOBILE_RIGHT,
      })
      xAxis.push(axes.xAxis)
      yAxis.push(axes.yAxis)
      order.push(benchmark)

      cursor += ROW_HEIGHT + (isLastInGroup ? AXIS_LABEL_SPACE : ROW_MARGIN)
    })
  })

  // `cursor` already includes the date-label space under the last row.
  const dataZoomTop = cursor
  return {
    grid,
    xAxis,
    yAxis,
    order,
    dataZoomTop,
    sliderLeft: MOBILE_LEFT,
    sliderRight: MOBILE_RIGHT,
    totalHeight: dataZoomTop + DATAZOOM_HEIGHT + BOTTOM,
  }
}

// Tablets/desktops: one column per group, side by side, equal total height.
const buildDesktopLayout = (groups) => {
  const columns = computeColumnGeometry(groups.length)
  const contentHeight = getContentHeight(groups)
  const grid = []
  const xAxis = []
  const yAxis = []
  const order = []

  groups.forEach((group, colIndex) => {
    const column = columns[colIndex]
    const count = group.stations.length
    const rowHeight = (contentHeight - (count - 1) * ROW_MARGIN) / count

    group.stations.forEach((benchmark, rowIndex) => {
      const isLastInColumn = rowIndex === count - 1
      const axes = createAxes(order.length, benchmark, isLastInColumn, false)

      grid.push({
        top: TOP + rowIndex * (rowHeight + ROW_MARGIN),
        height: rowHeight,
        left: `${column.left}%`,
        width: `${column.width}%`,
      })
      xAxis.push(axes.xAxis)
      yAxis.push(axes.yAxis)
      order.push(benchmark)
    })
  })

  const dataZoomTop = TOP + contentHeight + AXIS_LABEL_SPACE
  return {
    grid,
    xAxis,
    yAxis,
    order,
    dataZoomTop,
    sliderLeft: `${columns[0].left}%`,
    sliderRight: `${OUTER_MARGIN}%`,
    totalHeight: dataZoomTop + DATAZOOM_HEIGHT + BOTTOM,
  }
}

const buildLayout = (groups, isMobile) => {
  return isMobile ? buildMobileLayout(groups) : buildDesktopLayout(groups)
}

export const getGravityChartHeight = (groups, isMobile = false) => {
  const nonEmpty = groups.filter((g) => g.stations.length > 0)
  if (nonEmpty.length === 0) return 150
  return buildLayout(nonEmpty, isMobile).totalHeight
}

// Station order is identical on mobile and desktop, so no isMobile needed.
export const getGroupedStationTimeRanges = (groups) => {
  return groups
    .filter((g) => g.stations.length > 0)
    .flatMap((g) => g.stations)
    .map((benchmark) => {
      const timestamps = benchmark.ts.map((d) => toUnixMiliSeconds(d.period))
      return { min: Math.min(...timestamps), max: Math.max(...timestamps) }
    })
}

const createSeries = (order, annotations) => {
  return order.map((benchmark, index) => ({
    data: benchmark.ts.map((d) => [
      toUnixMiliSeconds(d.period),
      d.g_obs,
      benchmark.sta_fid,
      benchmark.sta,
    ]),
    name: benchmark.sta_fid,
    type: 'line',
    symbol: 'circle',
    symbolSize: 4,
    xAxisIndex: index,
    yAxisIndex: index,
    markLine: {
      symbol: 'none',
      data: annotations,
      animation: false,
    },
    itemStyle: {
      color:
        tab20ColorMap[smartIndex(index, order.length, tab20ColorMap.length)],
    },
  }))
}

const createDataZoom = (n, top, left, right) => [
  {
    type: 'slider',
    xAxisIndex: makeIndex(n),
    realtime: false,
    top,
    height: DATAZOOM_HEIGHT,
    left,
    right,
  },
]

export const tooltipFormatter = () => {
  return (params) => {
    if (Array.isArray(params) && params.length) {
      const template = []
      params.forEach((param, index) => {
        const { seriesName, value, color } = param
        if (index === 0) {
          template.push(`
            ${moment(value[0]).format('YYYY-MM-DD')}<br />
          `)
        }
        const hasValue =
          value[1] !== null && value[1] !== undefined && isFinite(value[1])
        template.push(`
        ${createCircleTemplate(color)} 
        ${value[3]} (${seriesName}): ${
          hasValue ? value[1].toFixed(4) : NO_DATA_NOTATION
        }<br />
        `)
      })
      return template.join('')
    } else {
      return ''
    }
  }
}

export const createGravityOverviewChartOptions = ({
  groups,
  annotations = [],
  isMobile = false,
}) => {
  const nonEmptyGroups = groups.filter((g) => g.stations.length > 0)

  if (nonEmptyGroups.length === 0) {
    return {
      baseOption: {
        backgroundColor: '#fff',
        title: {
          text: 'Gravity Overview',
          textStyle: { fontWeight: 'bold', fontSize: 14 },
          left: 'center',
        },
        toolbox: defaultToolbox,
      },
    }
  }

  const layout = buildLayout(nonEmptyGroups, isMobile)
  const allTimestamps = layout.order.flatMap((b) =>
    b.ts.map((d) => toUnixMiliSeconds(d.period))
  )
  const min = Math.min(...allTimestamps)
  const max = Math.max(...allTimestamps)
  const xAxisWithRange = layout.xAxis.map((axis) => ({ ...axis, min, max }))

  return {
    baseOption: {
      backgroundColor: '#fff',
      title: {
        text: 'Gravity Overview',
        left: 'center',
        top: 10,
        textStyle: { fontWeight: 'bold', fontSize: isMobile ? 13 : 14 },
      },
      toolbox: defaultToolbox,
      grid: layout.grid,
      xAxis: xAxisWithRange,
      yAxis: layout.yAxis,
      series: createSeries(layout.order, annotations),
      dataZoom: createDataZoom(
        layout.order.length,
        layout.dataZoomTop,
        layout.sliderLeft,
        layout.sliderRight
      ),
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross', lineStyle: { type: 'dashed' } },
        formatter: tooltipFormatter(),
      },
    },
  }
}
