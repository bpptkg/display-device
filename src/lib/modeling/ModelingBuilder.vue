<template>
  <div class="d-flex">
    <BCol md="6" lg="4">
      <BCard :header="headerName">
        <BRow class="pt-3">
          <BCol sm="4">
            <label><small>Period:</small></label>
          </BCol>
          <BCol>
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
            <label><small>Stations:</small></label>
            <BFormGroup>
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
                      >{{ station.name }}</BFormCheckbox
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

        <hr />

        <BRow class="my-1">
          <BCol sm="4">
            <label><small>G (Shear modulus):</small></label>
          </BCol>
          <BCol>
            <BFormInput v-model="cG" type="number" size="sm" />
          </BCol>
          <BCol class="px-0"><small>GPa</small></BCol>
        </BRow>

        <BRow class="my-1">
          <BCol sm="4">
            <label><small>&Delta;P (Source overpressure):</small></label>
          </BCol>
          <BCol>
            <BFormInput v-model="cdP" type="number" size="sm" />
          </BCol>
          <BCol class="px-0"><small>GPa</small></BCol>
        </BRow>

        <BRow class="my-1">
          <BCol sm="4">
            <label><small>&nu; (Poisson ratio):</small></label>
          </BCol>
          <BCol>
            <BFormInput v-model="cv" type="number" size="sm" />
          </BCol>
          <BCol class="px-0"><small></small></BCol>
        </BRow>
      </BCard>

      <BCard header="Result" class="mt-2">
        <div>
          Radius:
          {{ modeling.eps && modeling.eps.radius ? modeling.eps.radius : '-' }}
          m
        </div>
        <div>
          Volume magma:
          {{
            Number.isFinite(modeling.volume_magma)
              ? modeling.volume_magma.toFixed(4)
              : '-'
          }}
          &#x33a5;
        </div>
        <div>
          Residual total:
          {{
            modeling.eps && modeling.eps.res_total
              ? modeling.eps.res_total.toFixed(4)
              : '-'
          }}
        </div>
      </BCard>
    </BCol>

    <BCol md="6" lg="8">
      <div>
        <BButton @click="runLinregress" variant="outline-primary"
          ><BSpinner
            v-if="isFetchingLinregress"
            small
            label="Loading..."
            class="mr-1"
          ></BSpinner
          >Run Linregress</BButton
        >
        <BButton @click="runModeling" variant="outline-primary" class="ml-2"
          ><BSpinner
            v-if="isFetchingModeling"
            small
            label="Loading..."
            class="mr-1"
          ></BSpinner
          >Run Modeling</BButton
        >
      </div>
      <BTabs class="mt-2">
        <BTab title="Chart">
          <div class="mt-2">
            <BCol md="3" class="pl-0 mb-2">
              <BFormSelect
                v-model="cstation"
                :options="stations"
                @change="handleStationChange"
              ></BFormSelect>
            </BCol>
            <DChart
              ref="chart"
              :options="chartOptions"
              manual-update
              class="chart"
            />
            <DNote>
              <div>{{ cRegressionText.x }}</div>
              <div>{{ cRegressionText.z }}</div>
            </DNote>

            <hr />

            <DChart
              ref="modelingChart"
              :options="modelingChartOptions"
              class="chart"
            />
          </div>
        </BTab>
        <BTab title="Data">
          <BTable striped hover small :fields="dataFields" :items="iteration">
            <template #cell(actions)="row">
              <BLink @click="showIterationDetails(row.item)"> Details </BLink>
            </template>
          </BTable>

          <BModal ref="dialog" size="lg" title="Iteration Details" hide-footer>
            <BTable
              striped
              hover
              small
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
import { mapState, mapMutations, mapActions } from 'vuex'
import {
  BCol,
  BCard,
  BRow,
  BFormInput,
  BButton,
  BFormSelect,
  BTab,
  BTabs,
  BLink,
  BFormGroup,
  BFormCheckbox,
  BSpinner,
  BModal,
  BTable,
} from 'bootstrap-vue'
import DChart from '../../components/echarts/chart/DChart'
import RangeSelector from '../../components/range-selector'
import DNote from '../../components/base/note/DNote'
import { createTiltChart } from './tilt-chart'
import { createModelingChart } from './modeling-chart'
import { getSeriesByIndex } from '../../utils/series'

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
  // Utils.
  calculatePeriod,
  addTimeInterval,
} from './store'

export default {
  name: 'ModelingBuilder',
  components: {
    BRow,
    BCol,
    BCard,
    BFormInput,
    BButton,
    BFormSelect,
    DChart,
    BTab,
    BTabs,
    BFormCheckbox,
    BFormGroup,
    RangeSelector,
    BSpinner,
    DNote,
    BModal,
    BLink,
    BTable,
  },
  props: {
    type: String,
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
      const format = (value) => {
        return Number.isFinite(value) ? value.toFixed(4) : '-'
      }
      const index = this.stations.findIndex(
        (station) => station.id === this.station
      )
      const reg = this.linregress.regression
        ? this.linregress.regression[index]
        : null

      const r = reg ? reg.linreg : null

      let x, z
      if (r) {
        x = `
        X: m=${format(r.x.m)} c=${format(r.x.c)} r_value=${format(
          r.x.r_value
        )} std_err=${format(r.x.std_err)}`

        z = `Z: m=${format(r.z.m)} c=${format(r.z.c)} r_value=${format(
          r.z.r_value
        )} std_err=${format(r.z.std_err)}`
      } else {
        x = ''
        z = ''
      }

      return { x, z }
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
        radius: this.matchedRadius,
        depth: this.depth,
      })
      return opt
    },
    iteration() {
      return this.modeling.iteration ? this.modeling.iteration : []
    },
  },
  watch: {},
  mounted() {
    this.fetchStations().then(() => {
      this.updateData()
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
      const chart = this.$refs.chart.$refs.chart
      chart.clear()
      chart.showLoading()

      this.fetchData().finally(() => {
        chart.hideLoading()
        chart.mergeOptions(this.chartOptions)
      })
    },
    runLinregress() {
      this.calcLinregress().then(() => {
        this.updateData()
      })
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
    showIterationDetails(item) {
      const disp = item.displacements
      this.iterationDisplacements = disp.map((v) => {
        return {
          station: v.station,
          radius: v.radius,
          ux: v.displacement.ux,
          uz: v.displacement.uz,
          res: v.displacement.res,
        }
      })
      this.$refs.dialog.show()
    },
  },
}
</script>

<style lang="scss" scoped>
.chart {
  min-height: 450px;
}
</style>
