<template>
  <div>
    <div class="container">
      <RangeSelector
        ref="range-selector"
        size="sm"
        :custom-enabled="true"
        :selected="period"
        :items="rangeSelector"
        :max-custom-duration="maxCustomDuration"
        @period-selected="onPeriodChange"
        class="form-label"
      />
      <EventAnnotation
        :annotations="eventAnnotations"
        @change="handleAnnotationChange"
      />
    </div>
    <div
      class="d-flex align-items-center justify-content-end mt-2"
      style="margin-top: -30px !important"
      :style="{ 'margin-right': isDesktop ? '79px !important' : '0' }"
    >
      <MoreMenu right class="ml-2">
        <BDropdownItem @click="downloadData">Download Data</BDropdownItem>
      </MoreMenu>
    </div>

    <DChart
      ref="chart"
      :options="chartOptions"
      class="chart"
      :annotations="eventAnnotations"
    />

    <div class="bot-panel mt-3 d-lg-none">
      <BCard title="Statistics" title-tag="h6">
        <StatsPanelPeriod :start="start" :end="end" />
        <SidepanelListDivider />
        <StatsPanelTable
          :fields="fieldOptions"
          :items="statsInfo"
          scrollable
          show-no-data-label
        />
      </BCard>
    </div>

    <SidepanelTabs
      v-if="isDesktop"
      sidepanel-class="secondary-nav d-none d-md-block custom-side-panel"
    >
      <SidepanelTab title="Statistics" :icon="TimelineIcon" active no-body>
        <StatsPanelPeriod :start="start" :end="end" />
        <SidepanelListDivider />
        <StatsPanelTable
          :fields="fieldOptions"
          :items="statsInfo"
          scrollable
          show-no-data-label
        />
      </SidepanelTab>
    </SidepanelTabs>
  </div>
</template>

<script>
import client from '@/utils/client'
import DChart from '@/components/echarts/chart/DChart'
import RangeSelector from '@/components/range-selector'
import moment, { max, min } from 'moment'
import fieldOptions from '@/store/gbinsar/field-options'
import { debounce } from 'lodash'
import { BCard, BDropdownItem } from 'bootstrap-vue'
import {
  SidepanelListDivider,
  SidepanelTab,
  SidepanelTabs,
} from '@/components/sidepanel'
import {
  StatsPanelPeriod,
  StatsPanelTable,
} from '@/components/sidepanel/panel/stats'
import { getStatsAreaInfo } from '@/components/echarts/chart-options/gbinsar/utils'
import { defaultToolbox } from '@/components/echarts/chart-options/common/toolbox'
import { TimelineIcon } from '@/components/icons/content'
import { createCSVContent, createShortNameFromPeriod } from '@/utils/bulletin'
import { saveAs } from '@/lib/file-saver'
import MoreMenu from '@/components/more-menu'
import EventAnnotation from '@/components/event-annotation'
import annotations from '@/components/event-annotation/annotations'
import { DATETIME_FORMAT } from '@/constants/date'

export default {
  components: {
    DChart,
    RangeSelector,
    BCard,
    BDropdownItem,
    MoreMenu,
    SidepanelListDivider,
    SidepanelTab,
    SidepanelTabs,
    StatsPanelPeriod,
    StatsPanelTable,
    EventAnnotation,
  },
  data() {
    return {
      isDesktop: window.innerWidth >= 1024,
      dataPoints: [],
      TimelineIcon,
      fieldOptions,
      start: moment().subtract(1, 'month'),
      end: moment(),
      data: [],
      originalData: [],
      period: {
        count: 1,
        type: 'month',
        text: '1 month',
      },
      rangeSelector: [
        {
          count: 7,
          type: 'day',
          text: '7 days',
        },
        {
          count: 1,
          type: 'month',
          text: '1 month',
        },
        {
          count: 3,
          type: 'month',
          text: '3 months',
        },
        {
          count: 6,
          type: 'month',
          text: '6 months',
        },
        {
          count: 1,
          type: 'year',
          text: '1 year',
        },
      ],
      maxCustomDuration: {
        count: 4,
        type: 'year',
      },
      chartSeries: [],
      eventAnnotations: annotations,
      isLoading: true,
      debouncedFetchData: debounce(this.fetchData, 500),
    }
  },
  computed: {
    chartOptions() {
      const markLines = this.chartSeries
        .filter((series) => series.markLine)
        .map((series) => series.markLine)

      const seriesSet = new Set(this.chartSeries.map((series) => series.name))
      const seriesNames = this.chartSeries
        .filter(
          (series) =>
            !this.eventAnnotations.find(
              (annotation) => annotation.name === series.name
            )
        )
        .map((series) => series.name)
      if (this.isLoading) {
        return {}
      }

      return {
        title: {
          text: 'GBInsar Area Displacement',
          textStyle: {
            fontWeight: 'bold',
            fontSize: 16,
          },
          left: 'center',
        },
        xAxis: {
          type: 'time',
          axisPointer: {
            show: true,
            label: {
              formatter: (params) => {
                return moment(params.value).format('YYYY-MM-DD HH:mm:ss')
              },
            },
          },
        },
        yAxis: {
          type: 'value',
          name: 'Δx (mm)',
          axisLabel: {
            show: true,
            formatter: (value) => value.toFixed(0),
          },
        },
        grid: {
          top: 70,
          bottom: 150,
        },
        legend: {
          type: 'scroll',
          bottom: 35,
          data: seriesNames,
        },
        dataZoom: { type: 'slider', realtime: false, bottom: 75 },
        toolbox: {
          ...defaultToolbox,
          x: this.isDesktop ? '79%' : '67%',
          y: this.isDesktop ? '5%' : '5%',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
          },
          formatter: (params) => {
            const timestamp = moment(params[0].value[0]).format(
              'YYYY-MM-DD HH:mm:ss'
            )
            let tooltipContent = `Timestamp: ${timestamp}<br>`

            params
              .filter(
                (param) =>
                  !this.eventAnnotations.find(
                    (annotation) => annotation.name === param.seriesName
                  )
              )
              .forEach((param) => {
                tooltipContent += `${param.seriesName}: ${param.value[1]}<br>`
              })
            return tooltipContent
          },
        },
        series: this.chartSeries.map((series) => {
          return {
            ...series,
            symbol: 'none',
          }
        }),
        markLine: {
          symbol: 'none',
          data: this.chartSeries
            .filter((series) => series.markLine)
            .map((series) => series.markLine.data)
            .flat()
            .map((line) => ({
              ...line,
              xAxis: line.xAxis,
            })),
        },
      }
    },
    uncheckedAnnotations() {
      return this.eventAnnotations.filter((annotation) => !annotation.checked)
    },
    statsInfo() {
      return getStatsAreaInfo(this.dataPoints)
    },
    filteredOptions() {
      return this.eventAnnotations.filter((option) => option.checked)
    },
  },
  methods: {
    async fetchData() {
      try {
        const response = await client.get('gbinsar/babadanarea/', {
          params: {
            eventdate__gte: this.start.format('YYYY-MM-DD'),
            eventdate__lte: this.end.format('YYYY-MM-DD'),
          },
        })

        this.dataPoints = response.data.filter((dataPoint) => {
          const timestamp = new Date(dataPoint.timestamp)
          return timestamp >= this.start && timestamp <= this.end
        })

        this.chartSeries = [
          {
            name: 'Area1888',
            data: this.dataPoints.map((v) => [
              moment(v.timestamp).valueOf(),
              v.area1888,
            ]),
            type: 'line',
          },
          {
            name: 'Atas1888',
            data: this.dataPoints.map((v) => [
              moment(v.timestamp).valueOf(),
              v.atas1888,
            ]),
            type: 'line',
          },
          {
            name: 'Tengah1888',
            data: this.dataPoints.map((v) => [
              moment(v.timestamp).valueOf(),
              v.tengah1888,
            ]),
            type: 'line',
          },
          {
            name: 'Bawah1888',
            data: this.dataPoints.map((v) => [
              moment(v.timestamp).valueOf(),
              v.bawah1888,
            ]),
            type: 'line',
          },
        ]
        this.isLoading = false
        this.fetchAnnotations()
      } catch (error) {
        console.error('Request failed:', error)
      }
    },

    updateYAxisRange() {
      const selectedSeriesNames = this.chartSeries
        .filter((series) => series.data.length > 0 && !series.markLine)
        .map((series) => series.name)

      const minY = Math.min(
        ...this.chartSeries
          .filter((series) => selectedSeriesNames.includes(series.name))
          .map((series) => Math.min(...series.data.map((point) => point[1])))
      )

      const maxY = Math.max(
        ...this.chartSeries
          .filter((series) => selectedSeriesNames.includes(series.name))
          .map((series) => Math.max(...series.data.map((point) => point[1])))
      )

      this.$set(this.chartOptions.yAxis, 'min', minY + minY * 0.05)
      this.$set(this.chartOptions.yAxis, 'max', maxY - maxY * 0.05)
    },

    async downloadData() {
      const blob = new Blob([createCSVContent(this.dataPoints)], {
        type: 'text/csv;charset=utf-8',
      })
      saveAs(
        blob,
        `gbinsarbabadanarea-${createShortNameFromPeriod(this.period)}.csv`
      )
    },
    onPeriodChange(period, { startTime, endTime }) {
      this.start = startTime
      this.end = endTime
      this.fetchData()
    },
    updateDateRange() {
      this.start = moment().subtract(this.period.count, this.period.type)
      this.end = moment()
      this.fetchData()
    },
    fetchAnnotations() {
      try {
        const checkedAnnotations = this.eventAnnotations.filter(
          (v) => v.checked === true
        )
        const annotationData = []

        const requests = checkedAnnotations.map((annotation, index) => {
          if (annotation.isEarthquakeEvent) {
            return client.get('/bulletin/', {
              params: {
                eventdate__gte: this.start.format(DATETIME_FORMAT),
                eventdate__lt: this.end.format(DATETIME_FORMAT),
                eventtype: annotation.name,
                nolimit: true,
              },
              dataIndex: index,
            })
          } else {
            return Promise.resolve(annotation)
          }
        })

        Promise.all(requests).then((responses) => {
          responses.forEach((response) => {
            if (response.config !== undefined) {
              const annotation = checkedAnnotations[response.config.dataIndex]

              response.data.forEach((v) => {
                annotationData.push({
                  name: annotation.name,
                  data: [[v.eventdate, Number.MIN_VALUE, Number.MAX_VALUE]],
                  type: 'line',
                  markLine: {
                    symbol: 'none',
                    label: {
                      normal: {
                        show: false,
                      },
                    },
                    data: [
                      {
                        xAxis: moment(v.eventdate).valueOf(),
                        lineStyle: {
                          color: annotation.color,
                          type: annotation.lineStyle,
                        },
                      },
                    ],
                  },
                })
              })
            } else {
              annotationData.push({
                name: response.name,
                data: [
                  [response.eventdate, Number.MIN_VALUE, Number.MAX_VALUE],
                ],
                type: 'line',
                markLine: {
                  symbol: 'none',
                  label: {
                    normal: {
                      show: false,
                    },
                  },
                  data: [
                    {
                      xAxis: moment(response.eventdate).valueOf(),
                      lineStyle: {
                        color: response.color,
                        type: response.lineStyle,
                      },
                    },
                  ],
                },
              })
            }
          })

          const newChartSeries = this.chartSeries
            .filter((series) => !series.markLine)
            .concat(annotationData)

          this.chartSeries = newChartSeries
          this.updateYAxisRange()
        })
      } catch (error) {
        console.error('Failed to fetch event annotations:', error)
      }
    },

    handleResize() {
      this.isDesktop = window.innerWidth >= 1024
    },
    handleAnnotationChange(updatedAnnotations) {
      this.eventAnnotations = updatedAnnotations
      this.fetchAnnotations()
    },
  },

  mounted() {
    this.fetchAnnotations()
    this.debouncedFetchData()
    window.addEventListener('resize', this.handleResize)
  },
}
</script>

<style lang="scss" scoped>
.chart {
  height: 550px;
  width: 100%;
}

.custom-side-panel {
  position: fixed;
  top: 55px;
}

.container {
  display: flex;
  align-items: center;
}

.form-label {
  margin-right: 10px;
}
</style>
