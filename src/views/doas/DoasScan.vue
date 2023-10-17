<template>
  <div class="geochemistry-app">
    <!-- Left Side Menu -->
    <div class="left-menu">
      <div class="menu-title">GEOCHEMISTRY</div>
      <ul class="menu-list">
        <router-link to="/geochemistry/vogamos">
          <li>Vogamos</li>
        </router-link>
        <router-link to="/geochemistry/doas/babadan">
          <li>DOAS</li>
        </router-link>
        <router-link to="/doas-scan">
          <li>DOAS-Scan</li>
        </router-link>
      </ul>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <div style="margin-top: 60px">
        <div class="d-flex align-items-center ml-3">
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
        </div>
        <DChart ref="chart" :options="option" class="chart"></DChart>
      </div>
    </div>
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
      rangeValues: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
      selectedValue: 0,
    }
  },
  computed: {
    option() {
      return {
        xAxis: {
          type: 'time',
          name: 'Timestamp',
          nameTextStyle: {
            fontSize: '14', // Set the font size for the y-axis name
            fontFamily: 'sans-serif',
          },
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
          name: 'Flux (Ton/Day)',
          nameTextStyle: {
            fontSize: '14', // Set the font size for the y-axis name
            fontFamily: 'sans-serif',
          },
          axisPointer: {
            show: true, // Show axis pointers
          },
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

<style>
.chart {
  height: 400px;
}
.form-group {
  display: flex;
  align-items: center;
  margin-right: 3px; /* Adjust the spacing between boxes */
}
.ml-3 {
  margin-left: 3px; /* Adjust the spacing between boxes */
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
.geochemistry-app {
  display: flex;
}

.left-menu {
  width: 150px;
  background-color: white; /* Set background color to white */
  padding: 10px;
  position: fixed;
  height: 100%;
  overflow-y: auto;
  top: 50px; /* Adjust the top position to avoid overlap */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Add a box shadow for a nice effect */
  z-index: 1; /* Ensure the menu is above other content */
}

.menu-title {
  font-weight: 400;
  font-family: Verdana;
  margin-bottom: 10px;
  font-size: 14px;
  color: rgb(67, 67, 67);
}

.menu-list {
  list-style-type: none;
  padding: 3px;
  padding-left: 10px;
}

.menu-list li {
  margin: 15px 0;
  color: rgb(67, 67, 67);
  font-family: Verdana;
  font-size: 14px;
  cursor: pointer; /* Add cursor effect */
}

.menu-list li:hover {
  text-decoration: none !important; /* Add underline on hover */
}

.main-content {
  margin-left: 200px;
  flex: 1;
  padding: 20px;
  margin-top: 60px;
}
</style>
