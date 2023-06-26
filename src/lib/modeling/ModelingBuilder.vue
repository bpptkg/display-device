<template>
  <div class="d-flex flex-wrap">
    <BCol md="4" lg="3" class="mb-4">
      <BCard :header="headerName">
        <BRow>
          <BCol sm="4">
            <label><small>Period:</small></label>
          </BCol>
          <BCol>
            <div class="d-flex flex-wrap align-items-center">
              <RangeSelector
                ref="range-selector"
                size="sm"
                custom-enabled
                hide-period-label
                :selected="period"
                :items="periods"
                :max-custom-duration="maxCustomDuration"
                @period-selected="onPeriodChange"
              />
              <BIcon
                v-b-tooltip.hover
                class="ml-2 hand-cursor"
                :title="createIntervalText(startTime, endTime)"
                icon="info-circle"
              ></BIcon>
            </div>
          </BCol>
        </BRow>

        <hr />

        <BRow class="my-1">
          <BCol sm="4">
            <label><small>Depth:</small></label>
          </BCol>
          <BCol>
            <BFormInput v-model="cdepth" type="number" size="sm" />
          </BCol>
          <BCol class="px-0"><small>m</small></BCol>
        </BRow>

        <BRow class="my-1">
          <BCol sm="4">
            <label><small>Radius:</small></label>
          </BCol>
          <BCol>
            <BFormInput v-model="cradius" type="number" size="sm" />
          </BCol>
          <BCol class="px-0"><small>m</small></BCol>
        </BRow>

        <BRow class="my-1">
          <BCol sm="4">
            <label><small>Step:</small></label>
          </BCol>
          <BCol>
            <BFormInput v-model="cstep" type="number" size="sm" />
          </BCol>
          <BCol class="px-0"><small>m</small></BCol>
        </BRow>

        <BRow class="my-1">
          <BCol sm="4">
            <label><small>Max iteration:</small></label>
          </BCol>
          <BCol>
            <BFormInput v-model="cmaxIteration" type="number" size="sm" />
          </BCol>
          <BCol class="px-0"><small></small></BCol>
        </BRow>

        <hr />

        <BRow>
          <BCol>
            <div>
              <small><span class="font-weight-bold">Stations:</span></small>
            </div>
            <ErrorMessage v-if="stationError">
              <p>Unable to load stations.</p>
              <p>Error: {{ stationError.message }}</p>
              <p>
                <BLink @click="fetchStations"> Try again </BLink>
              </p>
            </ErrorMessage>
            <BFormGroup v-show="!stationError">
              <table>
                <tr>
                  <th><small>Name</small></th>
                  <th><small>Ux</small></th>
                  <th><small>Uz</small></th>
                </tr>
                <tr v-for="(station, index) in stations" :key="index">
                  <td>
                    <BFormCheckbox
                      v-model="cSelectedStations"
                      :value="station.id"
                      :name="station.name"
                      inline
                      ><small>{{ station.name }}</small></BFormCheckbox
                    >
                  </td>
                  <td>
                    <BFormInput
                      :value="getUx(index)"
                      @change="(value) => handleUxChange(value, index)"
                      type="number"
                      size="sm"
                    />
                  </td>
                  <td>
                    <BFormInput
                      :value="getUz(index)"
                      @change="(value) => handleUzChange(value, index)"
                      type="number"
                      size="sm"
                    />
                  </td>
                </tr>
              </table>
            </BFormGroup>
          </BCol>
        </BRow>

        <BRow>
          <BCol>
            <div class="d-flex h-100 justify-content-end">
              <BButton @click="runLinregress" variant="outline-primary"
                ><BSpinner
                  v-if="isFetchingLinregress"
                  small
                  label="Loading..."
                  class="mr-1"
                ></BSpinner
                >Run Linregress</BButton
              >
            </div>
          </BCol>
        </BRow>

        <hr />

        <BRow class="my-1">
          <BCol sm="4">
            <label class="mr-1"><small>G </small></label>
            <small>
              <BIcon
                v-b-tooltip.hover
                title="Shear modulus"
                icon="info-circle"
                class="hand-cursor"
              ></BIcon>
            </small>
          </BCol>
          <BCol>
            <BFormInput v-model="cG" type="number" size="sm" />
          </BCol>
          <BCol class="px-0"><small>GPa</small></BCol>
        </BRow>

        <BRow class="my-1">
          <BCol sm="4">
            <label class="mr-1"><small>&Delta;P </small></label>
            <small>
              <BIcon
                v-b-tooltip.hover
                title="Source overpressure"
                icon="info-circle"
                class="hand-cursor"
              ></BIcon>
            </small>
          </BCol>
          <BCol>
            <BFormInput v-model="cdP" type="number" size="sm" />
          </BCol>
          <BCol class="px-0"><small>GPa</small></BCol>
        </BRow>

        <BRow class="my-1">
          <BCol sm="4">
            <label class="mr-1"><small>&nu;</small></label>
            <small>
              <BIcon
                v-b-tooltip.hover
                title="Possion's ratio"
                icon="info-circle"
                class="hand-cursor"
              ></BIcon>
            </small>
          </BCol>
          <BCol>
            <BFormInput v-model="cv" type="number" size="sm" />
          </BCol>
          <BCol class="px-0"><small></small></BCol>
        </BRow>

        <BRow class="mt-3">
          <BCol>
            <div class="d-flex h-100 justify-content-end">
              <BButton
                @click="runModeling"
                variant="outline-primary"
                class="ml-2"
                ><BSpinner
                  v-if="isFetchingModeling"
                  small
                  label="Loading..."
                  class="mr-1"
                ></BSpinner
                >Run Modeling</BButton
              >
            </div>
          </BCol>
        </BRow>

        <hr />

        <BRow>
          <BCol>
            <div>
              <small><span class="font-weight-bold">Results:</span></small>
            </div>
            <div>
              <small>
                Radius:
                {{
                  modeling.eps && modeling.eps.radius
                    ? modeling.eps.radius
                    : '-'
                }}
                m
              </small>
            </div>
            <div>
              <small>
                Volume magma:
                {{
                  Number.isFinite(modeling.volume_magma)
                    ? modeling.volume_magma.toFixed(4)
                    : '-'
                }}
                &#x33a5;
              </small>
            </div>
            <div>
              <small>
                Residual total:
                {{
                  modeling.eps && modeling.eps.res_total
                    ? modeling.eps.res_total.toFixed(4)
                    : '-'
                }}
              </small>
            </div>
          </BCol>
        </BRow>
      </BCard>
    </BCol>

    <BCol class="mb-4">
      <BTabs class="mt-2">
        <BTab title="Chart">
          <div class="d-flex align-items-center flex-wrap">
            <BCol md="3" class="pl-0 mb-1 mt-2">
              <BFormSelect
                v-model="cstation"
                :options="stations"
                @change="handleStationChange"
              ></BFormSelect>
            </BCol>
          </div>
          <BRow>
            <BCol ref="tiltContainer" lg="6" class="px-0">
              <ErrorMessage v-if="dataError">
                <p>Unable to load data.</p>
                <p>Error: {{ dataError.message }}</p>
                <p>
                  <BLink @click="updateData"> Try again </BLink>
                </p>
              </ErrorMessage>
              <div v-show="!dataError">
                <DChart ref="chart" :options="chartOptions" class="chart" />
              </div>
            </BCol>

            <BCol ref="vectorContainer" lg="6" class="px-0">
              <ErrorMessage v-if="vectorError">
                <p>Unable to load data.</p>
                <p>Error: {{ vectorError.message }}</p>
                <p>
                  <BLink @click="updateVectorChart"> Try again </BLink>
                </p>
              </ErrorMessage>
              <div v-show="!vectorError">
                <div v-if="isVectorImageAvailable" v-html="vectorImage"></div>
                <DChart
                  v-else
                  ref="vectorChart"
                  :options="vectorChartOptions"
                  class="chart"
                />
              </div>
            </BCol>
          </BRow>

          <BRow>
            <BCol ref="residualContainer" lg="6" class="px-0">
              <ErrorMessage v-if="modelingError">
                <p>Unable to load data.</p>
                <p>Error: {{ modelingError.message }}</p>
                <p>
                  <BLink @click="fetchTopo"> Try again </BLink>
                </p>
              </ErrorMessage>
              <div v-show="!modelingError">
                <DChart
                  ref="residualChart"
                  :options="residualChartOptions"
                  class="chart"
                />
              </div>
            </BCol>

            <BCol ref="modelingContainer" lg="6" class="px-0">
              <ErrorMessage v-if="modelingError">
                <p>Unable to load data.</p>
                <p>Error: {{ modelingError.message }}</p>
                <p>
                  <BLink @click="fetchTopo"> Try again </BLink>
                </p>
              </ErrorMessage>
              <div v-show="!modelingError">
                <DChart
                  ref="modelingChart"
                  :options="modelingChartOptions"
                  class="chart"
                />
              </div>
            </BCol>
          </BRow>
        </BTab>
        <BTab title="Data">
          <BTable
            striped
            hover
            small
            responsive
            :fields="dataFields"
            :items="iteration"
          >
            <template #cell(actions)="row">
              <BLink @click="showIterationDetails(row.item)"> Details </BLink>
            </template>
          </BTable>

          <BModal ref="dialog" size="lg" title="Iteration Details" hide-footer>
            <BTable
              striped
              hover
              small
              responsive
              :fields="detailFields"
              :items="iterationDisplacements"
            >
            </BTable>
          </BModal>
        </BTab>
      </BTabs>
    </BCol>
  </div>
</template>

<script>
import { debounce } from 'lodash'
import { mapState, mapMutations, mapActions } from 'vuex'
import {
  BCol,
  BCard,
  BRow,
  BFormInput,
  BButton,
  BTab,
  BTabs,
  BLink,
  BFormGroup,
  BFormCheckbox,
  BFormSelect,
  BSpinner,
  BModal,
  BTable,
  BIcon,
} from 'bootstrap-vue'
import { VBTooltip } from 'bootstrap-vue'
import DChart from '../../components/echarts/chart/DChart'
import RangeSelector from '../../components/range-selector'
import { createTiltChart } from './tilt-chart'
import { createModelingChart } from './modeling-chart'
import { getSeriesByIndex } from '../../utils/series'
import ErrorMessage from '@/components/error-message'
import { createVectorChart } from './vector-chart'
import { createResidualChart } from './residual-chart'

import {
  // Mutations.
  SET_PERIOD,
  SET_START_TIME,
  SET_END_TIME,
  SET_STATIONS,
  SET_SELECTED_STATIONS,
  SET_DEPTH,
  SET_RADIUS,
  SET_STEP,
  SET_MAX_ITERATION,
  SET_SHEAR_MODULUS,
  SET_SOURCE_OVERPRESSURE,
  SET_POISSON_RATIO,
  SET_DISP_UX,
  SET_DISP_UZ,
  SET_STATION_TO_PLOT,
  // Actions.
  FETCH_STATIONS,
  FETCH_DATA,
  FETCH_TOPO,
  CALC_LINREGRESS,
  CALC_MODELING,
  CALC_VECTOR,
  // Utils.
  calculatePeriod,
  addTimeInterval,
} from './store'

export default {
  name: 'ModelingBuilder',
  components: {
    BButton,
    BCard,
    BCol,
    BFormCheckbox,
    BFormGroup,
    BFormInput,
    BIcon,
    BLink,
    BModal,
    BRow,
    BSpinner,
    BTab,
    BTable,
    BTabs,
    DChart,
    ErrorMessage,
    RangeSelector,
    BFormSelect,
  },
  props: {
    type: String,
  },
  directives: {
    'b-tooltip': VBTooltip,
  },
  data() {
    return {
      maxCustomDuration: {
        count: 5,
        type: 'years',
      },
      iterationDisplacements: [],
      dataFields: [
        {
          key: 'radius',
          label: 'Radius',
        },
        {
          key: 'res_total',
          label: 'Residual Total',
        },
        {
          key: 'actions',
          label: 'Action',
        },
      ],
      detailFields: [
        {
          key: 'radius',
          label: 'Radius',
        },
        {
          key: 'station',
          label: 'Station',
        },
        {
          key: 'ux',
          label: 'Ux',
        },
        {
          key: 'uz',
          label: 'Uz',
        },
        {
          key: 'res',
          label: 'Residual',
        },
      ],
      radiusScale: 1,
    }
  },
  computed: {
    ...mapState({
      isFetchingLinregress(state) {
        return state.modeling[this.type].isFetchingLinregress
      },
      isFetchingModeling(state) {
        return state.modeling[this.type].isFetchingModeling
      },
      isFetching(state) {
        return state.modeling[this.type].isFetching
      },
      period(state) {
        return state.modeling[this.type].period
      },
      periods(state) {
        return state.modeling[this.type].periods
      },
      startTime(state) {
        return state.modeling[this.type].startTime
      },
      endTime(state) {
        return state.modeling[this.type].endTime
      },
      stations(state) {
        return state.modeling[this.type].stations
      },
      selectedStations(state) {
        return state.modeling[this.type].selectedStations
      },
      depth(state) {
        return state.modeling[this.type].depth
      },
      radius(state) {
        return state.modeling[this.type].initialRadius
      },
      step(state) {
        return state.modeling[this.type].step
      },
      maxIteration(state) {
        return state.modeling[this.type].maxIteration
      },
      G(state) {
        return state.modeling[this.type].G
      },
      dP(state) {
        return state.modeling[this.type].dP
      },
      v(state) {
        return state.modeling[this.type].v
      },
      ux(state, index) {
        return state.modeling[this.type].stations[index].ux
      },
      station(state) {
        return state.modeling[this.type].station
      },
      data(state) {
        return state.modeling[this.type].data
      },
      linregress(state) {
        return state.modeling[this.type].linregress
      },
      topo(state) {
        return state.modeling[this.type].topo
      },
      modeling(state) {
        return state.modeling[this.type].modeling
      },
      stationError(state) {
        return state.modeling[this.type].stationError
      },
      dataError(state) {
        return state.modeling[this.type].dataError
      },
      modelingError(state) {
        return state.modeling[this.type].modelingError
      },
      linregressError(state) {
        return state.modeling[this.type].linregressError
      },
      vectorImage(state) {
        return state.modeling[this.type].vector.image || ''
      },
      vectorError(state) {
        return state.modeling[this.type].vectorError
      },
    }),
    cSelectedStations: {
      get() {
        return this.selectedStations
      },
      set(value) {
        this.setSelectedStations(value)
      },
    },
    cdepth: {
      get() {
        return this.depth
      },
      set(value) {
        this.setDepth(value)
      },
    },
    cradius: {
      get() {
        return this.radius
      },
      set(value) {
        this.setRadius(value)
      },
    },
    cstep: {
      get() {
        return this.step
      },
      set(value) {
        this.setStep(value)
      },
    },
    cmaxIteration: {
      get() {
        return this.maxIteration
      },
      set(value) {
        this.setMaxIteration(value)
      },
    },
    cG: {
      get() {
        return this.G
      },
      set(value) {
        this.setShearModulus(value)
      },
    },
    cdP: {
      get() {
        return this.dP
      },
      set(value) {
        this.setSourceOverpressure(value)
      },
    },
    cv: {
      get() {
        return this.v
      },
      set(value) {
        this.setPoissonRatio(value)
      },
    },
    cstation: {
      get() {
        return this.station
      },
      set(value) {
        this.setStationToPlot(value)
      },
    },
    cRegressionText() {
      const index = this.stations.findIndex(
        (station) => station.id === this.station
      )
      return this.createRegressionText(index)
    },
    namespace() {
      return `modeling/${this.type}`
    },
    headerName() {
      return this.type == 'tilt' ? 'Tilt Modeling' : 'GPS Modeling'
    },
    chartOptions() {
      const index = this.stations.findIndex(
        (station) => station.id === this.station
      )
      const station = this.stations[index]
      const { start, end } = addTimeInterval(this.startTime, this.endTime)
      const regtext = this.createRegressionText(index)

      return createTiltChart({
        data: getSeriesByIndex(this.data, index),
        xreg: station
          ? station.linreg_point
            ? station.linreg_point.x
              ? station.linreg_point.x
              : []
            : []
          : [],
        zreg: station
          ? station.linreg_point
            ? station.linreg_point.z
              ? station.linreg_point.z
              : []
            : []
          : [],
        startTime: start,
        endTime: end,
        xtext: regtext.x,
        ztext: regtext.z,
      })
    },
    matchedRadius() {
      return this.modeling.eps && this.modeling.eps.radius
        ? this.modeling.eps.radius
        : 0
    },
    modelingChartOptions() {
      const opt = createModelingChart({
        topo: this.topo,
        radius: this.matchedRadius * this.radiusScale,
        depth: this.depth,
      })
      return opt
    },
    iteration() {
      return this.modeling.iteration ? this.modeling.iteration : []
    },
    visibleStations() {
      const selectedStations = this.selectedStations
      return this.stations.filter((station) => {
        return selectedStations.includes(station.id)
      })
    },
    vectorChartOptions() {
      return createVectorChart()
    },
    residualChartOptions() {
      return createResidualChart({
        modeling: this.modeling,
      })
    },
    isVectorImageAvailable() {
      if (this.vectorImage) {
        return true
      }
      return false
    },
  },
  watch: {
    linregressError(error) {
      if (error) {
        this.$bvToast.toast(error.message, {
          title: 'Error',
          variant: 'default',
          solid: true,
        })
      }
    },
    radiusScale(_value) {
      debounce(this.refreshModelingChart, 200)()
    },
  },
  created() {},
  mounted() {
    this.fetchStations().then(() => {
      this.$nextTick(() => {
        this.updateData()
      })
    })

    this.fetchTopo()
  },
  methods: {
    ...mapMutations({
      setPeriod(commit, period) {
        return commit(this.namespace + '/' + SET_PERIOD, period)
      },
      setStartTime(commit, value) {
        return commit(this.namespace + '/' + SET_START_TIME, value)
      },
      setEndTime(commit, value) {
        return commit(this.namespace + '/' + SET_END_TIME, value)
      },
      setStations(commit, value) {
        return commit(this.namespace + '/' + SET_STATIONS, value)
      },
      setSelectedStations(commit, value) {
        return commit(this.namespace + '/' + SET_SELECTED_STATIONS, value)
      },
      setDepth(commit, value) {
        return commit(this.namespace + '/' + SET_DEPTH, value)
      },
      setRadius(commit, value) {
        return commit(this.namespace + '/' + SET_RADIUS, value)
      },
      setStep(commit, value) {
        return commit(this.namespace + '/' + SET_STEP, value)
      },
      setMaxIteration(commit, value) {
        return commit(this.namespace + '/' + SET_MAX_ITERATION, value)
      },
      setShearModulus(commit, value) {
        return commit(this.namespace + '/' + SET_SHEAR_MODULUS, value)
      },
      setSourceOverpressure(commit, value) {
        return commit(this.namespace + '/' + SET_SOURCE_OVERPRESSURE, value)
      },
      setPoissonRatio(commit, value) {
        return commit(this.namespace + '/' + SET_POISSON_RATIO, value)
      },
      setDispUx(commit, value) {
        return commit(this.namespace + '/' + SET_DISP_UX, value)
      },
      setDispUz(commit, value) {
        return commit(this.namespace + '/' + SET_DISP_UZ, value)
      },
      setStationToPlot(commit, value) {
        return commit(this.namespace + '/' + SET_STATION_TO_PLOT, value)
      },
    }),
    ...mapActions({
      fetchStations(dispatch) {
        return dispatch(this.namespace + '/' + FETCH_STATIONS)
      },
      calcLinregress(dispatch) {
        return dispatch(this.namespace + '/' + CALC_LINREGRESS)
      },
      calcModeling(dispatch) {
        return dispatch(this.namespace + '/' + CALC_MODELING)
      },
      calcVector(dispatch, payload = {}) {
        return dispatch(this.namespace + '/' + CALC_VECTOR, payload)
      },
      fetchData(dispatch) {
        return dispatch(this.namespace + '/' + FETCH_DATA)
      },
      fetchTopo(dispatch) {
        return dispatch(this.namespace + '/' + FETCH_TOPO)
      },
    }),
    onPeriodChange(period) {
      this.setPeriod(period)
      const { startTime, endTime } = calculatePeriod(period)
      this.setStartTime(startTime)
      this.setEndTime(endTime)
      this.updateData()
    },
    getUx(index) {
      const station = this.stations[index]
      return station ? station.ux : null
    },
    getUz(index) {
      const station = this.stations[index]
      return station ? station.uz : null
    },
    handleUxChange(value, index) {
      this.setDispUx({ value: Number(value), index })
    },
    handleUzChange(value, index) {
      this.setDispUz({ value: Number(value), index })
    },
    handleStationChange() {
      this.updateData()
    },
    updateData() {
      this.fetchData()
    },
    getVectorContainerSize() {
      const width = this.$refs.vectorContainer.offsetWidth
      const height = this.$refs.vectorContainer.offsetHeight
      return {
        width,
        height,
      }
    },
    getModelingContainerSize() {
      const width = this.$refs.modelingContainer.offsetWidth
      const height = this.$refs.modelingContainer.offsetHeight
      return {
        width,
        height,
      }
    },
    runLinregress() {
      this.calcLinregress().then(() => {
        this.updateData()
      })
      this.updateVectorChart()
    },
    runModeling() {
      this.calcModeling().finally(() => {
        const chart = this.$refs.modelingChart.$refs.chart
        chart.clear()
        chart.showLoading()
        chart.mergeOptions(this.modelingChartOptions)
        chart.hideLoading()
      })
    },
    refreshModelingChart() {
      const chart = this.$refs.modelingChart.$refs.chart
      chart.clear()
      chart.showLoading()
      chart.mergeOptions(this.modelingChartOptions)
      chart.hideLoading()
    },
    updateVectorChart() {
      const size = this.getVectorContainerSize()
      this.calcVector(size)
    },
    showIterationDetails(item) {
      const disp = item.displacements
      this.iterationDisplacements = disp.map((v) => {
        return {
          station: v.station,
          radius: item.radius,
          ux: v.displacement.ux,
          uz: v.displacement.uz,
          res: v.displacement.res,
        }
      })
      this.$refs.dialog.show()
    },
    createChartOptions(index) {
      const station = this.stations[index]
      const { start, end } = addTimeInterval(this.startTime, this.endTime)
      const regText = this.createRegressionText(index)

      return createTiltChart({
        data: getSeriesByIndex(this.data, index),
        xreg: station
          ? station.linreg_point
            ? station.linreg_point.x
              ? station.linreg_point.x
              : []
            : []
          : [],
        zreg: station
          ? station.linreg_point
            ? station.linreg_point.z
              ? station.linreg_point.z
              : []
            : []
          : [],
        xtext: regText.x,
        ztext: regText.z,
        startTime: start,
        endTime: end,
      })
    },
    createRegressionText(index) {
      const format = (value) => {
        return Number.isFinite(value) ? value.toFixed(2) : '-'
      }

      const reg = this.linregress.regression
        ? this.linregress.regression[index]
        : null

      const r = reg ? reg.linreg : null

      let x, z
      if (r) {
        x = `m=${format(r.x.m)} r2=${format(r.x.r_value)} err=${format(
          r.x.std_err
        )}`

        z = `m=${format(r.z.m)} r2=${format(r.z.r_value)} err=${format(
          r.z.std_err
        )}`
      } else {
        x = ''
        z = ''
      }

      return { x, z }
    },
    createIntervalText(startTime, endTime) {
      return `${startTime.format('YYYY-MM-DD HH:mm:ss')} ~ ${endTime.format(
        'YYYY-MM-DD HH:mm:ss'
      )}`
    },
  },
}
</script>

<style lang="scss" scoped>
.modeling-chart {
  min-height: 450px;
  width: 100%;
}

.grid-container {
  display: flex;
  flex-wrap: wrap;
}

/* Create four equal columns */
.grid-item {
  flex: 25%;
  padding: 10px;
}

@media screen and (max-width: 992px) {
  .grid-item {
    flex: 50%;
  }
}

@media screen and (max-width: 600px) {
  .grid-container {
    flex-direction: column;
  }
}

.hand-cursor {
  cursor: pointer;
}
</style>
