<template>
  <div class="d-flex flex-wrap" style="margin-top: 60px">
    <BCol sm="3">
      <BCard header="Settings" class="panel">
        <ScrollWrapper>
          <BRow class="my-1">
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
              <label><small>Width:</small></label>
            </BCol>
            <BCol>
              <BFormInput v-model="cwidth" type="number" size="sm" />
            </BCol>
            <BCol sm="2"><small>px</small></BCol>
          </BRow>

          <BRow class="my-1">
            <BCol sm="4">
              <label><small>Height:</small></label>
            </BCol>
            <BCol>
              <BFormInput v-model="cheight" type="number" size="sm" />
            </BCol>
            <BCol sm="2"><small>px</small></BCol>
          </BRow>

          <BRow class="my-1">
            <BCol sm="4">
              <label><small>Theme:</small></label>
            </BCol>
            <BCol>
              <BFormSelect v-model="ctheme" :options="themes" size="sm" />
            </BCol>
          </BRow>

          <hr />

          <BRow class="my-1">
            <BCol sm="4">
              <label><small>Benchmark:</small></label>
            </BCol>
            <BCol>
              <BFormSelect
                v-model="cbenchmark"
                :options="benchmarks"
                size="sm"
                :disabled="isFetching"
              />
            </BCol>
          </BRow>

          <BRow class="my-1">
            <BCol sm="4">
              <label><small>Reflector:</small></label>
            </BCol>
            <BCol>
              <BFormSelect
                v-model="creflector"
                :options="reflectors"
                size="sm"
                :disabled="isFetching"
              />
            </BCol>
          </BRow>

          <hr />

          <BRow>
            <BCol>
              <label><small>Events:</small></label>
            </BCol>
          </BRow>
          <BFormGroup>
            <BFormCheckboxGroup
              v-model="cSelectedEvents"
              :options="events"
              stacked
              :disabled="isFetching"
            />
          </BFormGroup>

          <hr />

          <BRow class="my-1">
            <BCol sm="4">
              <label><small>EDM Y Label:</small></label>
            </BCol>
            <BCol>
              <BFormInput v-model="cEdmYLabel" size="sm" />
            </BCol>
          </BRow>

          <BRow class="my-1">
            <BCol sm="4">
              <label><small>Gap:</small></label>
            </BCol>
            <BCol>
              <BFormInput v-model="cEdmNameGap" size="sm" type="number" />
            </BCol>
          </BRow>

          <hr />

          <BRow class="my-1">
            <BCol sm="4">
              <label><small>Seismicity Y Label:</small></label>
            </BCol>
            <BCol>
              <BFormInput v-model="cSeismicityYLabel" size="sm" />
            </BCol>
          </BRow>

          <BRow class="my-1">
            <BCol sm="4">
              <label><small>Gap:</small></label>
            </BCol>
            <BCol>
              <BFormInput
                v-model="cSeismicityNameGap"
                size="sm"
                type="number"
              />
            </BCol>
          </BRow>

          <hr />
          <label><small>Margin (%):</small></label>

          <div class="d-flex flex-column justify-content-center w-100">
            <div class="d-flex align-items-end justify-content-center">
              <div class="margin">
                <BFormInput
                  size="sm"
                  type="number"
                  placeholder="Top"
                  v-model="cMarginTop"
                />
              </div>
            </div>
            <div class="d-flex align-items-center justify-content-center w-100">
              <div class="margin">
                <BFormInput
                  size="sm"
                  type="number"
                  placeholder="Left"
                  v-model="cMarginLeft"
                />
              </div>
              <div class="page"></div>
              <div class="margin">
                <BFormInput
                  size="sm"
                  type="number"
                  placeholder="Right"
                  v-model="cMarginRight"
                />
              </div>
            </div>
            <div class="d-flex justify-content-center">
              <div class="margin">
                <BFormInput
                  size="sm"
                  type="number"
                  placeholder="Bottom"
                  v-model="cMarginBottom"
                />
              </div>
            </div>
          </div>
        </ScrollWrapper>
      </BCard>
    </BCol>

    <BCol>
      <BCard class="panel" no-body>
        <template #header>
          <div class="d-flex justify-content-between align-items-center">
            <h6>Chart</h6>

            <MoreMenu right class="ml-2">
              <BDropdownItem @click="downloadAsSVG">
                Download as SVG
              </BDropdownItem>
              <BDropdownItem @click="downloadAsPNG">
                Download as PNG
              </BDropdownItem>
            </MoreMenu>
          </div>
        </template>

        <ErrorMessage v-if="error">
          <p>Unable to load data.</p>
          <p>Error: {{ error.message }}</p>
          <p>
            <BLink @click="update"> Try again </BLink>
          </p>
        </ErrorMessage>
        <div class="preview">
          <div class="canvas">
            <div v-show="!error" id="chart" :style="style"></div>
          </div>
          <div class="overlay" :style="stylehiddenoverlay"></div>
          <div id="charthidden" :style="stylehidden"></div>
        </div>
      </BCard>

      <div class="my-2">
        <small>
          Period: <code>{{ startTime.format(DATETIME_FORMAT) }}</code> ~
          <code>{{ endTime.format(DATETIME_FORMAT) }}</code>
        </small>
      </div>
    </BCol>
  </div>
</template>

<script>
import { debounce } from 'lodash'
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import {
  BCard,
  BRow,
  BCol,
  BFormInput,
  BFormSelect,
  BLink,
  BDropdownItem,
  BFormGroup,
  BFormCheckboxGroup,
} from 'bootstrap-vue'
import Panzoom from '@panzoom/panzoom'
import { createChartOptions } from './chart'
import RangeSelector from '@/components/range-selector'
import ErrorMessage from '@/components/error-message'
import MoreMenu from '@/components/more-menu'
import { saveAs } from '@/lib/file-saver'
import ScrollWrapper from './ScrollWrapper'
import { DateRangeTypes } from '../../constants/date'
import { UPDATE_DATA } from '../../store/base/actions'
import {
  SET_END_TIME,
  SET_PERIOD,
  SET_START_TIME,
} from '../../store/base/mutations'
import { toUnixMiliSeconds } from '../../utils/series'
import {
  SET_BENCHMARK,
  SET_REFLECTOR,
  SET_HEIGHT,
  SET_WIDTH,
  SET_EDM_NAME_GAP,
  SET_SEISMICITY_NAME_GAP,
  SET_THEME,
  SET_SELECTED_EVENTS,
  SET_MARGIN_LEFT,
  SET_MARGIN_RIGHT,
  SET_MARGIN_TOP,
  SET_MARGIN_BOTTOM,
  SET_EDM_YLABEL,
  SET_SEISMICITY_YLABEL,
} from './store'
import {
  EDMBenchmark,
  EDMBenchmarkReflectorRelation,
} from '../../constants/edm'
import { DATETIME_FORMAT } from '../../constants/date'

import './theme/chalk'
import './theme/dark'
import './theme/essos'
import './theme/infographic'
import './theme/macarons'
import './theme/purple-passion'
import './theme/roma'
import './theme/shine'
import './theme/vintage'
import './theme/walden'
import './theme/westeros'
import './theme/wonderland'

const NAMESPACE = 'infographic'
const PIXEL_RATIO = 3

const init = (theme = 'default') => {
  const context = theme === 'default' ? null : theme
  // eslint-disable-next-line
  return echarts.init(document.getElementById('chart'), context, {
    renderer: 'svg',
  })
}

export default {
  name: 'InfographicView',
  components: {
    BCard,
    BRow,
    BCol,
    BFormInput,
    BFormSelect,
    ScrollWrapper,
    RangeSelector,
    ErrorMessage,
    BLink,
    MoreMenu,
    BDropdownItem,
    BFormCheckboxGroup,
    BFormGroup,
  },
  data() {
    return {
      DATETIME_FORMAT,
      chart: null,
      benchmarks: Object.values(EDMBenchmark),
      isBenchmarkUpdating: false,
      maxCustomDuration: {
        count: 6,
        type: 'months',
      },
    }
  },
  computed: {
    ...mapState({
      isFetching: (state) => state.infographic.isFetching,
      selectedEvents: (state) => state.infographic.selectedEvents,
      events: (state) => state.infographic.events,
      periods: (state) => state.infographic.periods,
      period: (state) => state.infographic.period,
      startTime: (state) => state.infographic.startTime,
      endTime: (state) => state.infographic.endTime,
      error: (state) => state.infographic.error,
      benchmark: (state) => state.infographic.benchmark,
      reflector: (state) => state.infographic.reflector,
      width: (state) => state.infographic.width,
      height: (state) => state.infographic.height,
      edmNameGap: (state) => state.infographic.edmNameGap,
      seismicityNameGap: (state) => state.infographic.seismicityNameGap,
      theme: (state) => state.infographic.theme,
      themes: (state) => state.infographic.themes,
      marginLeft: (state) => state.infographic.marginLeft,
      marginRight: (state) => state.infographic.marginRight,
      marginTop: (state) => state.infographic.marginTop,
      marginBottom: (state) => state.infographic.marginBottom,
      edmYLabel: (state) => state.infographic.edmYLabel,
      seismicityYLabel: (state) => state.infographic.seismicityYLabel,
    }),

    ...mapGetters(NAMESPACE, ['edmData', 'seismicityData']),

    cSelectedEvents: {
      get() {
        return this.selectedEvents
      },
      set(selected) {
        const sorted = this.events.filter((e) => selected.includes(e.value))
        this.setSelectedEvents(sorted.map((e) => e.value))
        this.update()
      },
    },

    cbenchmark: {
      get() {
        return this.benchmark
      },
      set(value) {
        this.isBenchmarkUpdating = true
        this.setReflector(EDMBenchmarkReflectorRelation[value][0])
        this.setBenchmark(value)
        this.isBenchmarkUpdating = false

        this.update()
      },
    },

    creflector: {
      get() {
        return this.reflector
      },
      set(value) {
        if (!this.isBenchmarkUpdating) {
          this.setReflector(value)

          this.update()
        }
      },
    },

    cwidth: {
      get() {
        return this.width
      },
      set: debounce(function (value) {
        this.setWidth(value)

        this.update({ dirty: false, clear: false })
      }, 500),
    },

    cheight: {
      get() {
        return this.height
      },
      set: debounce(function (value) {
        this.setHeight(value)

        this.update({ dirty: false, clear: false })
      }, 500),
    },

    cEdmNameGap: {
      get() {
        return this.edmNameGap
      },
      set: debounce(function (value) {
        this.setEdmNameGap(value)

        this.update({ dirty: false, clear: false })
      }, 500),
    },

    cSeismicityNameGap: {
      get() {
        return this.seismicityNameGap
      },
      set: debounce(function (value) {
        this.setSeismicityNameGap(value)

        this.update({ dirty: false, clear: false })
      }, 500),
    },

    cMarginLeft: {
      get() {
        return this.marginLeft
      },
      set: debounce(function (value) {
        this.setMarginLeft(
          typeof value === 'string' ? parseFloat(value) : value
        )

        this.update({ dirty: false, clear: false })
      }, 500),
    },

    cMarginRight: {
      get() {
        return this.marginRight
      },
      set: debounce(function (value) {
        this.setMarginRight(
          typeof value === 'string' ? parseFloat(value) : value
        )

        this.update({ dirty: false, clear: false })
      }, 500),
    },

    cMarginTop: {
      get() {
        return this.marginTop
      },
      set: debounce(function (value) {
        this.setMarginTop(typeof value === 'string' ? parseFloat(value) : value)

        this.update({ dirty: false, clear: false })
      }, 500),
    },

    cMarginBottom: {
      get() {
        return this.marginBottom
      },
      set: debounce(function (value) {
        this.setMarginBottom(
          typeof value === 'string' ? parseFloat(value) : value
        )

        this.update({ dirty: false, clear: false })
      }, 500),
    },

    ctheme: {
      get() {
        return this.theme
      },
      set(value) {
        this.setTheme(value)
        this.chart.dispose()
        // eslint-disable-next-line
        this.chart = init(value)
        this.update({ dirty: false, clear: true, showLoading: false })
      },
    },

    cEdmYLabel: {
      get() {
        return this.edmYLabel
      },
      set: debounce(function (value) {
        this.setEdmYLabel(value)
        this.update({ dirty: false, clear: false })
      }, 500),
    },

    cSeismicityYLabel: {
      get() {
        return this.seismicityYLabel
      },
      set: debounce(function (value) {
        this.setSeismicityYLabel(value)
        this.update({ dirty: false, clear: false })
      }, 500),
    },

    reflectors() {
      return EDMBenchmarkReflectorRelation[this.cbenchmark]
    },

    style() {
      return {
        position: 'absolute',
        'z-index': 999,
        minWidth: `${this.cwidth}px`,
        minHeight: `${this.cheight}px`,
        backgroundColor: '#fff',
      }
    },

    stylehidden() {
      return {
        position: 'absolute',
        'z-index': 1,
        minWidth: `${this.cwidth}px`,
        minHeight: `${this.cheight}px`,
      }
    },

    stylehiddenoverlay() {
      return {
        position: 'absolute',
        'z-index': 50,
        minWidth: `${this.cwidth}px`,
        minHeight: `${this.cheight}px`,
        backgroundColor: '#fff',
      }
    },

    chartOptions() {
      const options = createChartOptions({
        edmData: this.edmData,
        seismicityData: this.seismicityData,
        // ECharts bugs, need to adjust min and max to prevent the bar from
        // overlapping with the vertical Y axis.
        tMin: toUnixMiliSeconds(this.startTime.clone().subtract(1, 'days')),
        tMax: toUnixMiliSeconds(this.endTime.clone().add(1, 'days')),
        benchmark: this.benchmark,
        reflector: this.reflector,
        events: this.selectedEvents,
        edmYLabel: this.edmYLabel,
        seismicityYLabel: this.seismicityYLabel,
        edmNameGap: this.edmNameGap,
        seismicityNameGap: this.seismicityNameGap,
        marginLeft: this.marginLeft,
        marginRight: this.marginRight,
        marginTop: this.marginTop,
        marginBottom: this.marginBottom,
      })

      return options
    },
  },

  watch: {},

  mounted() {
    this.chart = init(this.theme)
    window.addEventListener('resize', this.chart.resize)
    this.update()
    const dom = document.getElementById('chart')
    const panzoom = Panzoom(dom, {
      maxScale: 5,
    })
    panzoom.zoom(0.8)
    dom.parentElement.addEventListener('wheel', panzoom.zoomWithWheel)
  },

  methods: {
    ...mapMutations({
      setPeriod(commit, period) {
        return commit(NAMESPACE + '/' + SET_PERIOD, period)
      },
      setStartTime(commit, value) {
        return commit(NAMESPACE + '/' + SET_START_TIME, value)
      },
      setEndTime(commit, value) {
        return commit(NAMESPACE + '/' + SET_END_TIME, value)
      },
      setBenchmark(commit, value) {
        return commit(NAMESPACE + '/' + SET_BENCHMARK, value)
      },
      setReflector(commit, value) {
        return commit(NAMESPACE + '/' + SET_REFLECTOR, value)
      },
      setWidth(commit, value) {
        return commit(NAMESPACE + '/' + SET_WIDTH, value)
      },
      setHeight(commit, value) {
        return commit(NAMESPACE + '/' + SET_HEIGHT, value)
      },
      setEdmNameGap(commit, value) {
        return commit(NAMESPACE + '/' + SET_EDM_NAME_GAP, value)
      },
      setSeismicityNameGap(commit, value) {
        return commit(NAMESPACE + '/' + SET_SEISMICITY_NAME_GAP, value)
      },
      setTheme(commit, value) {
        return commit(NAMESPACE + '/' + SET_THEME, value)
      },
      setSelectedEvents(commit, value) {
        return commit(NAMESPACE + '/' + SET_SELECTED_EVENTS, value)
      },
      setMarginLeft(commit, value) {
        return commit(NAMESPACE + '/' + SET_MARGIN_LEFT, value)
      },
      setMarginRight(commit, value) {
        return commit(NAMESPACE + '/' + SET_MARGIN_RIGHT, value)
      },
      setMarginTop(commit, value) {
        return commit(NAMESPACE + '/' + SET_MARGIN_TOP, value)
      },
      setMarginBottom(commit, value) {
        return commit(NAMESPACE + '/' + SET_MARGIN_BOTTOM, value)
      },
      setEdmYLabel(commit, value) {
        return commit(NAMESPACE + '/' + SET_EDM_YLABEL, value)
      },
      setSeismicityYLabel(commit, value) {
        return commit(NAMESPACE + '/' + SET_SEISMICITY_YLABEL, value)
      },
    }),

    ...mapActions({
      fetchData(dispatch, payload = {}) {
        return dispatch(NAMESPACE + '/' + UPDATE_DATA, payload)
      },
    }),

    update(options = {}) {
      const { clear = true, showLoading = true } = options
      const chart = this.chart
      if (clear) {
        chart.clear()
        if (showLoading) {
          chart.showLoading()
        }
      }

      this.fetchData(options).finally(() => {
        chart.hideLoading()
        chart.setOption(this.chartOptions)
        chart.resize()
      })
    },

    onPeriodChange(period, { startTime, endTime }) {
      if (period.type === DateRangeTypes.CUSTOM) {
        this.setPeriod(period)
        this.setStartTime(startTime)
        this.setEndTime(endTime)
        this.update()
      } else {
        this.setPeriod(period)
        this.update()
      }
    },

    downloadAsSVG() {
      if (!this.chart) {
        return
      }
      const src = this.chart.getDataURL({
        type: 'svg',
        pixelRatio: PIXEL_RATIO,
      })
      saveAs(src, 'chart.svg')
    },

    downloadAsPNG() {
      if (!this.chart) {
        return
      }
      // eslint-disable-next-line
      const chart = echarts.init(
        document.getElementById('charthidden'),
        this.theme,
        {
          renderer: 'canvas',
        }
      )
      chart.on('finished', () => {
        const src = chart.getDataURL({
          type: 'png',
          pixelRatio: PIXEL_RATIO,
        })
        saveAs(src, 'chart.png')
        chart.dispose()
      })
      chart.setOption(this.chartOptions)
    },
  },
}
</script>

<style lang="scss">
.preview {
  width: 100%;
  height: 100%;
  position: relative;
}

.canvas {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ececec;
  z-index: 99;
}

.page {
  width: 70px;
  height: 70px;
  border: 1px solid rgba(0, 0, 0, 0.6);
  margin: 10px;

  &--dark {
    border: 1px solid #fff;
  }
}

.margin {
  width: 70px;
}

.panel {
  height: 500px;
}
</style>
