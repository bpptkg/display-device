<template>
  <div style="margin-top: 60px">
    <BFormSelect v-model="station" :options="stationOptions"></BFormSelect>
    <DChart :options="option" class="chart"></DChart>
  </div>
</template>

<script>
import { BFormSelect } from 'bootstrap-vue'
import DChart from '@/components/echarts/chart/DChart'
import client from '@/utils/client'
import { toUnixMiliSeconds } from '@/utils/series'

export default {
  components: {
    DChart,
    BFormSelect,
  },
  data() {
    return {
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
      client
        .get('/doas-scan/', {
          params: {
            start: '2023-09-01 10:00:00',
            end: '2023-09-01 11:00:00',
            station: this.station,
          },
        })
        .then((response) => {
          this.data = response.data
          console.log(this.data)
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
  },
}
</script>

<style>
.chart {
  height: 400px;
}
</style>
