<template>
  <!-- Main Content -->
  <div class="main-content">
    <div>
      <div class="d-flex flex-wrap justify-content-start align-items-center">
        <div
          class="form-group mr-3 d-flex align-items-center"
          style="margin-top: 10px"
        >
          <label for="plumeCompleteness" class="mr-2 form-label label-adjust"
            >Min. Plume Completeness:</label
          >
          <select
            id="plumeCompleteness"
            v-model="selectedValue"
            @change="applyFilter"
            class="form-control adjustable-box"
            style="margin: 0; padding: 5px; margin-top: 4px"
          >
            <option
              v-for="value in rangeValues"
              :key="value"
              :value="value"
              class="form-option"
            >
              {{ value }}%
            </option>
          </select>
        </div>
        <RangeSelector
          ref="range-selector"
          size="sm"
          custom-enabled
          :selected="period"
          :items="rangeSelector"
          :max-custom-duration="maxCustomDuration"
          @period-selected="onPeriodChange"
          class="form-label"
        />
        <BFormSelect
          class="col-2 ml-3"
          size="sm"
          v-model="station"
          :options="stationOptions"
        ></BFormSelect>
        <BButton
          @click="downloadData"
          style="
            background-color: transparent;
            border: 1px solid rgb(207, 207, 207);
            margin-left: 80px;
          "
          size="sm"
          class="ml3"
        >
          <span class="custom-dropdown-item-text">Download Data</span>
        </BButton>
      </div>
      <DChart ref="chart" :options="option" class="chart"></DChart>
    </div>
    <div class="bot-panel mt-3">
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
    <SidepanelTabs sidepanel-class="secondary-nav">
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
import { BFormSelect } from 'bootstrap-vue'
import { BCard, BButton } from 'bootstrap-vue'
import DChart from '@/components/echarts/chart/DChart'
import client from '@/utils/client'
import { toUnixMiliSeconds } from '@/utils/series'
import RangeSelector from '@/components/range-selector'
import moment from 'moment'
import {
  SidepanelListDivider,
  SidepanelTab,
  SidepanelTabs,
} from '@/components/sidepanel'
import {
  StatsPanelPeriod,
  StatsPanelTable,
} from '@/components/sidepanel/panel/stats'
import fieldOptions from '@/store/geochemistry/doas/field-options'
import { getStatsInfo } from '@/components/echarts/chart-options/doas/utils'
import { defaultToolbox } from '@/components/echarts/chart-options/common/toolbox'
import { createCSVContent, createShortNameFromPeriod } from '@/utils/bulletin'
import { saveAs } from '@/lib/file-saver'
import TimelineIcon from '@/components/icons/action/TimelineIcon'

export default {
  components: {
    BButton,
    BCard,
    DChart,
    BFormSelect,
    RangeSelector,
    SidepanelListDivider,
    SidepanelTab,
    SidepanelTabs,
    StatsPanelPeriod,
    StatsPanelTable,
  },
  data() {
    return {
      fieldOptions,
      start: moment().subtract(1, 'month'),
      end: moment(),
      data: [],
      originalData: [], // To store the original unfiltered data
      station: 'jrakah',
      stationOptions: [
        {
          value: 'babadan1',
          text: 'Babadan',
        },
        {
          value: 'jrakah',
          text: 'Jrakah',
        },
        {
          value: 'kaliurang',
          text: 'Kaliurang',
        },
      ],
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
        type: 'years',
      },
      showDefaultText: true,
      rangeValues: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
      selectedValue: 0,
      TimelineIcon,
    }
  },
  computed: {
    option() {
      const stationText =
        this.stationOptions.find((opt) => opt.value === this.station)?.text ||
        ''
      return {
        title: {
          text: 'DOAS-Scan ' + stationText,
          textStyle: {
            fontWeight: 'bold',
            fontSize: 16, // You can adjust the font size as needed
          },
          left: 'center', // Center the title horizontally
        },
        xAxis: {
          type: 'time',
          axisPointer: {
            show: true, // Show axis pointers
            label: {
              formatter: function (params) {
                return moment(params.value).format('YYYY-MM-DD HH:mm:ss')
              },
            },
          },
        },
        yAxis: {
          type: 'value',
          name: 'SO\u2082 flux (ton/day)',
          nameTextStyle: {
            fontSize: '14', // Set the font size for the y-axis name
            fontFamily: 'sans-serif',
          },
          axisPointer: {
            show: true, // Show axis pointers
          },
        },
        grid: {
          top: 70,
          bottom: 80,
        },
        toolbox: {
          ...defaultToolbox,
        },
        tooltip: {
          trigger: 'axis', // Trigger on mouse hover
          axisPointer: {
            type: 'cross', // Display axis pointers as a cross
          },
          formatter: function (params) {
            // Display the timestamp and the Y-axis value (flux)
            return (
              'Timestamp: ' +
              moment(params[0].value[0]).format('YYYY-MM-DD HH:mm:ss') +
              '<br>' +
              'Flux: ' +
              params[0].value[1] +
              '&nbsp;' +
              'ton/day' +
              '<br>' +
              'Plume Completeness: ' +
              params[0].value[2] +
              '%'
            )
          },
        },
        series: [
          {
            data: this.data.map((v) => [
              toUnixMiliSeconds(v.timestamp),
              v.flux,
              v.plumecompleteness,
            ]),
            type: 'scatter', // Change the chart type to 'scatter'
            symbol: 'circle',
            symbolSize: 6, // Customize the symbol size
            itemStyle: {
              color: '#0077b6', // Customize the color of the points
            },
          },
        ],
      }
    },
    statsInfo() {
      return getStatsInfo(this.data)
    },
  },

  methods: {
    async fetchData() {
      const chart = this.$refs.chart.$refs.chart
      chart.showLoading()

      try {
        const response = await client.get('/doas-scan/', {
          params: {
            start: this.start.format('YYYY-MM-DD HH:mm:ss'),
            end: this.end.format('YYYY-MM-DD HH:mm:ss'),
            station: this.station,
          },
        })

        this.data = response.data
        this.originalData = response.data // Store the original unfiltered data
        this.applyFilter() // Apply the initial filter
      } catch (error) {
        console.error('Request failed:', error)
      } finally {
        chart.hideLoading()
      }
    },
    async downloadData() {
      const blob = new Blob([createCSVContent(this.data)], {
        type: 'text/csv;charset=utf-8',
      })
      saveAs(
        blob,
        `doasscan-${this.station}-${createShortNameFromPeriod(this.period)}.csv`
      )
    },
    calculateAverage(data) {
      // Calculate the average of an array of numbers
      if (data.length === 0) return 0

      const sum = data.reduce((acc, value) => acc + value, 0)
      return sum / data.length
    },
    onPeriodChange(period, { startTime, endTime }) {
      this.start = startTime
      this.end = endTime
      this.fetchData()
    },
    applyFilter() {
      // Filter the data based on "plumecompleteness"
      this.data = this.originalData.filter((item) => {
        return item.plumecompleteness >= this.selectedValue
      })
    },
  },
  mounted() {
    this.fetchData()
  },
  watch: {
    station() {
      this.fetchData()
    },
    // Watch for changes in selectedValue
    selectedValue() {
      this.applyFilter()
    },
  },
}
</script>

<style lang="scss" scoped>
.chart {
  height: 500px;
  width: 100%;
}
.form-group {
  display: flex;
  align-items: center;
  margin-right: 1px; /* Adjust the spacing between boxes */
}
.ml-3 {
  margin-left: 1px; /* Adjust the spacing between boxes */
}
.form-label,
.form-option,
.form-select {
  font-family: sans-serif, sans-serif;
  font-size: 14px;
}

.form-control {
  font-size: 14px;
}

.adjustable-box {
  width: auto;
  height: 30px; /* Adjust the width as needed */
}
.label-adjust {
  margin-bottom: 0;
  margin-top: 0;
  margin-right: 0.5rem; /* Adjust as needed to center the label */
  color: rgb(94, 94, 94);
}
.custom-dropdown-item-text {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: 14px;
  color: rgb(94, 94, 94);
  list-style-type: none;
}

.main-content {
  margin-left: 0px;
  flex: 1;
}
@import '@/scss/layout-monkey';

@media (min-width: 991.98px) {
  .bot-panel {
    display: none;
  }
}
</style>
