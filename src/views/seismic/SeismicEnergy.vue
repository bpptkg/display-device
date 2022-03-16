<template>
  <div class="content">
    <BCard v-if="error">
      <ErrorMessage>
        <p>Unable to load data.</p>
        <p>Error: {{ error.message }}</p>
        <p>
          <BLink @click="update"> Try again </BLink>
        </p>
      </ErrorMessage>
    </BCard>

    <BCard v-show="!error">
      <div
        class="d-flex justify-content-between align-items-center flex-wrap mb-3"
      >
        <div class="d-flex align-items-center flex-wrap">
          <RangeSelector
            ref="range-selector"
            size="sm"
            custom-enabled
            :selected="period"
            :items="rangeSelector"
            :max-custom-duration="maxCustomDuration"
            @period-selected="onPeriodChange"
          />
          <EventAnnotation
            class="ml-2"
            :annotations="annotationOptions"
            @change="handleUpdateAnnotations"
          />
        </div>
        <div class="d-flex align-items-center">
          <MoreMenu right class="ml-2">
            <BDropdownItem @click="downloadData"> Download Data </BDropdownItem>
          </MoreMenu>
        </div>
      </div>
      <BNav tabs class="mt-2 mb-2">
        <BNavItem
          v-for="(item, index) in tabNav"
          :key="index"
          :to="item.to"
          exact-active-class="active"
        >
          {{ item.text }}
        </BNavItem>
      </BNav>
      <router-view :key="$route.path"></router-view>
    </BCard>

    <div class="bot-panel mt-3">
      <BCard title="Statistics" title-tag="h6">
        <StatsPanelPeriod
          :start="startTime"
          :end="endTime"
          scrollable
          show-no-data-label
        />
        <StatsPanelTable
          :fields="fieldOptions"
          :items="statsInfo"
          scrollable
          show-no-data-label
        />
        <div class="p-2">
          <span style="font-size: 12px">
            All values are in Megajoule (MJ) unit.
          </span>
        </div>
      </BCard>
    </div>

    <SidepanelTabs sidepanel-class="secondary-nav">
      <SidepanelTab title="Statistics" :icon="TimelineIcon" active no-body>
        <StatsPanelPeriod :start="startTime" :end="endTime" />
        <SidepanelListDivider />
        <StatsPanelTable
          :fields="fieldOptions"
          :items="statsInfo"
          scrollable
          show-no-data-label
        />
        <div class="p-2">
          <span style="font-size: 12px">
            All values are in Megajoule (MJ) unit.
          </span>
        </div>
      </SidepanelTab>
    </SidepanelTabs>
  </div>
</template>

<script>
import JSZip from 'jszip'
import { mapState, mapActions, mapMutations } from 'vuex'
import { BCard, BLink, BNav, BNavItem, BDropdownItem } from 'bootstrap-vue'

import { saveAs } from '@/lib/file-saver'
import { getSeriesByIndex } from '@/utils/series'
import { createCSVContent, createShortNameFromPeriod } from '@/utils/bulletin'
import { DateRangeTypes } from '@/constants/date'
import { EnergyTypes, EnergyTotalSeriesIndex } from '@/constants/energy'
import {
  EVENT_UPDATE_CHART_DISPATCHED,
  EVENT_UPDATE_ANNOTATION_DISPATCHED,
} from '@/constants/events/energy'
import EventBus from '@/utils/event-bus'

import {
  SidepanelTab,
  SidepanelTabs,
  SidepanelListDivider,
} from '@/components/sidepanel'
import {
  StatsPanelPeriod,
  StatsPanelTable,
} from '@/components/sidepanel/panel/stats'
import { TimelineIcon } from '@/components/icons/content'
import ErrorMessage from '@/components/error-message'
import RangeSelector from '@/components/range-selector'
import MoreMenu from '@/components/more-menu'
import EventAnnotation from '@/components/event-annotation'
import { getStatsInfo } from '@/components/echarts/chart-options/seismic/energy/utils'

import rangeSelector, {
  maxCustomDuration,
} from '@/store/seismic/energy/range-selector'
import fieldOptions from '@/store/seismic/energy/field-options'
import {
  SET_PERIOD,
  SET_START_TIME,
  SET_END_TIME,
  SET_ANNOTATION_OPTIONS,
} from '@/store/base/mutations'
import { UPDATE_ANNOTATIONS } from '@/store/base/actions'
import { UPDATE_ENERGY } from '@/store/seismic/energy/actions'

const tabNav = [
  {
    to: { path: 'total' },
    text: 'Total',
  },
  {
    to: { path: 'vta' },
    text: 'VTA',
  },
  {
    to: { path: 'vtbmp' },
    text: 'VTB+MP',
  },
]

export default {
  name: 'SeismicEnergy',
  components: {
    BCard,
    BDropdownItem,
    BLink,
    BNav,
    BNavItem,
    ErrorMessage,
    EventAnnotation,
    MoreMenu,
    RangeSelector,
    SidepanelListDivider,
    SidepanelTab,
    SidepanelTabs,
    StatsPanelPeriod,
    StatsPanelTable,
  },
  props: {
    type: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      interval: null,
      fieldOptions,
      maxCustomDuration,
      rangeSelector,
      tabNav,
      TimelineIcon,
    }
  },
  beforeDestroy() {
    if (this.interval !== null) {
      clearInterval(this.interval)
    }
  },
  mounted() {
    this.interval = setInterval(this.update, 900000)
  },
  computed: {
    ...mapState({
      data(state) {
        return state.seismic.energy[this.type].data
      },
      error(state) {
        return state.seismic.energy[this.type].error
      },
      period(state) {
        return state.seismic.energy[this.type].period
      },
      startTime(state) {
        return state.seismic.energy[this.type].startTime
      },
      endTime(state) {
        return state.seismic.energy[this.type].endTime
      },
      annotationOptions(state) {
        return state.seismic.energy[this.type].annotationOptions
      },
      annotations(state) {
        return state.seismic.energy[this.type].annotations
      },
    }),
    namespace() {
      return `seismic/energy/${this.type}`
    },
    statsInfo() {
      return getStatsInfo(this.data, this.type)
    },
  },
  methods: {
    ...mapMutations({
      setPeriod(commit, namespace, period) {
        return commit(namespace + '/' + SET_PERIOD, period)
      },
      setStartTime(commit, namespace, value) {
        return commit(namespace + '/' + SET_START_TIME, value)
      },
      setEndTime(commit, namespace, value) {
        return commit(namespace + '/' + SET_END_TIME, value)
      },
      setAnnotationOptions(commit, namespace, options) {
        return commit(namespace + '/' + SET_ANNOTATION_OPTIONS, options)
      },
    }),
    ...mapActions({
      fetchData(dispatch) {
        return dispatch(this.namespace + '/' + UPDATE_ENERGY)
      },
      updateAnnotations(dispatch) {
        return dispatch(this.namespace + '/' + UPDATE_ANNOTATIONS)
      },
    }),
    createNamespace(type) {
      return `seismic/energy/${type}`
    },
    update() {
      EventBus.$emit(EVENT_UPDATE_CHART_DISPATCHED)
    },
    onPeriodChange(period, { startTime, endTime }) {
      const types = Object.values(EnergyTypes)

      if (period.type === DateRangeTypes.CUSTOM) {
        types.forEach((type) => {
          this.setPeriod(this.createNamespace(type), period)
          this.setStartTime(this.createNamespace(type), startTime)
          this.setEndTime(this.createNamespace(type), endTime)
        })
        EventBus.$emit(EVENT_UPDATE_CHART_DISPATCHED)
      } else {
        types.forEach((type) => {
          this.setPeriod(this.createNamespace(type), period)
        })
        EventBus.$emit(EVENT_UPDATE_CHART_DISPATCHED)
      }
    },
    handleUpdateAnnotations(options) {
      const types = Object.values(EnergyTypes)
      types.forEach((type) => {
        this.setAnnotationOptions(this.createNamespace(type), options)
      })
      EventBus.$emit(EVENT_UPDATE_ANNOTATION_DISPATCHED)
    },
    async downloadData() {
      const zip = new JSZip()
      if (this.type === EnergyTypes.TOTAL) {
        zip.file(
          'energy-total.csv',
          createCSVContent(
            getSeriesByIndex(
              this.data,
              EnergyTotalSeriesIndex[EnergyTypes.TOTAL]
            )
          )
        )
        zip.file(
          'energy-vta.csv',
          createCSVContent(
            getSeriesByIndex(this.data, EnergyTotalSeriesIndex[EnergyTypes.VTA])
          )
        )
        zip.file(
          'energy-vtbmp.csv',
          createCSVContent(
            getSeriesByIndex(
              this.data,
              EnergyTotalSeriesIndex[EnergyTypes.VTBMP]
            )
          )
        )
      } else if (this.type === EnergyTypes.VTA) {
        zip.file('energy-vta.csv', createCSVContent(this.data))
      } else if (this.type === EnergyTypes.VTBMP) {
        zip.file('energy-vtbmp.csv', createCSVContent(this.data))
      } else {
        // Pass
      }

      zip.generateAsync({ type: 'blob' }).then((content) => {
        saveAs(
          content,
          `seismic-energy-${this.type}-${createShortNameFromPeriod(
            this.period
          )}.zip`
        )
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/scss/layout-monkey';

.nav-wrapper {
  flex-wrap: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}

@media (min-width: 991.98px) {
  .bot-panel {
    display: none;
  }
}
</style>
