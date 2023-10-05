<template>
  <div style="margin-top: 60px">
    <div class="d-flex align-items-center ml-3">
      <RangeSelector
        ref="range-selector"
        size="sm"
        custom-enabled
        :selected="period"
        :items="rangeSelector"
        :max-custom-duration="maxCustomDuration"
        @period-selected="onPeriodChange"
      />
      <BFormSelect
        class="ml-3 col-2"
        size="sm"
        v-model="station"
        :options="stationOptions"
      ></BFormSelect>
    </div>
    <DChart ref="chart" :options="option" class="chart"></DChart>
  </div>
</template>

<script>
import { BFormSelect } from 'bootstrap-vue'
import DChart from '@/components/echarts/chart/DChart'
import client from '@/utils/client'
import { toUnixMiliSeconds } from '@/utils/series'
import RangeSelector from '@/components/range-selector'
import moment from 'moment'

export default {
  components: {
    DChart,
    BFormSelect,
    RangeSelector,
  },
  data() {
    return {
      start: moment().subtract(7, 'days'),
      end: moment(),
      data: [],
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
        count: 7,
        type: 'day',
        text: '7 days',
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
    }
  },
  computed: {
    option() {
      return {
        xAxis: {
          type: 'time',
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: this.data.map((v) => [
              toUnixMiliSeconds(v.timestamp),
              v.flux,
            ]),
            type: 'line',
          },
        ],
      }
    },
  },
  methods: {
    async fetchData() {
      const chart = this.$refs.chart.$refs.chart
      chart.showLoading()

      client
        .get('/doas-scan/', {
          params: {
            start: this.start.format('YYYY-MM-DD HH:mm:ss'),
            end: this.end.format('YYYY-MM-DD HH:mm:ss'),
            station: this.station,
          },
        })
        .then((response) => {
          this.data = response.data
        })
        .catch((error) => {
          alert('Reqest failed. Please go home.')
        })
        .finally(() => {
          chart.hideLoading()
        })
    },
    onPeriodChange(period, { startTime, endTime }) {
      this.start = startTime
      this.end = endTime
      this.fetchData()
    },
  },
  mounted() {
    this.fetchData()
  },
  watch: {
    station() {
      this.fetchData()
    },
  },
}
</script>

<style>
.chart {
  height: 400px;
}
</style>
