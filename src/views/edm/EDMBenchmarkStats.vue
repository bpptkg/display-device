<template>
  <div>
    <StatsPanelPeriod :start="startTime" :end="endTime" />
    <SidepanelListDivider />
    <StatsPanelTable
      :fields="fieldOptions"
      :items="statsInfo"
      scrollable
      show-no-data-label
    />
    <SidepanelListDivider />
    <StatsPanelTable
      title="Linear Regression"
      :fields="linregressFieldOptions"
      :items="linregressInfo"
      scrollable
      show-no-data-label
    />
    <div class="p-2">
      <input v-model="showRegression" type="checkbox" />
      <label for="checkbox"><small>Show regression line</small></label>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { SidepanelListDivider } from '@/components/sidepanel'
import {
  StatsPanelPeriod,
  StatsPanelTable,
} from '@/components/sidepanel/panel/stats'
import {
  getStatsInfo,
  getLinearRegressionInfo,
} from '@/components/echarts/chart-options/edm/utils'
import fieldOptions, { linregressFieldOptions } from '@/store/edm/field-options'
import { SET_SHOW_REGRESSION_LINE } from '@/store/edm/mutations'

export default {
  name: 'EDMBenchmarkStats',
  components: {
    SidepanelListDivider,
    StatsPanelPeriod,
    StatsPanelTable,
  },
  props: {
    benchmark: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      fieldOptions,
      linregressFieldOptions,
    }
  },
  computed: {
    ...mapState({
      data(state) {
        return state.edm[this.benchmark].data
      },
      reflectors(state) {
        return state.edm[this.benchmark].reflectors
      },
      startTime(state) {
        return state.edm[this.benchmark].startTime
      },
      endTime(state) {
        return state.edm[this.benchmark].endTime
      },
      showRegressionLine(state) {
        return state.edm[this.benchmark].showRegressionLine
      },
    }),
    namespace() {
      return `edm/${this.benchmark}`
    },
    statsInfo() {
      return getStatsInfo(this.data, this.reflectors)
    },
    linregressInfo() {
      return getLinearRegressionInfo(this.data, this.reflectors)
    },
    showRegression: {
      get() {
        return this.showRegressionLine
      },
      set(value) {
        this.setShowRegressionLine(value)
      },
    },
  },
  methods: {
    ...mapMutations({
      setShowRegressionLine(commit, value) {
        return commit(this.namespace + '/' + SET_SHOW_REGRESSION_LINE, value)
      },
    }),
  },
}
</script>
