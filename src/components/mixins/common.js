import { DateRangeTypes } from '../../constants/date'

export function update() {
  const chart = this.$refs.chart.$refs.chart
  chart.clear()
  chart.showLoading()

  Promise.all([this.fetchData(), this.updateAnnotations()]).finally(() => {
    chart.hideLoading()
    chart.mergeOptions(this.chartOptions)
  })
}

export function onPeriodChange(period, { startTime, endTime }) {
  if (period.type === DateRangeTypes.CUSTOM) {
    this.setPeriod(period)
    this.setStartTime(startTime)
    this.setEndTime(endTime)
    this.update()
  } else {
    this.setPeriod(period)
    this.update()
  }
}

export function updateChart({ withLoading = true, clear = true } = {}) {
  const chart = this.$refs.chart.$refs.chart
  if (clear) {
    chart.clear()
  }
  if (withLoading) {
    chart.showLoading()
  }
  chart.mergeOptions(this.chartOptions)
}

export function handleUpdateAnnotations(options) {
  const chart = this.$refs.chart.$refs.chart
  chart.clear()
  chart.showLoading()

  this.setAnnotationOptions(options)
  this.updateAnnotations().finally(() => {
    chart.hideLoading()
    chart.mergeOptions(this.chartOptions)
  })
}
