<template>
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
      <StatsPanelTable
        title="Linear Regression"
        :fields="linregressFieldOptions"
        :items="linregressInfo"
        scrollable
        show-no-data-label
      />
      <input v-model="showRegression" type="checkbox" />
      <label for="checkbox"><small>Show regression line</small></label>
    </BCard>
  </div>
</template>

<script>
import { BCard } from 'bootstrap-vue'
import { mapState, mapMutations } from 'vuex'
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
  name: 'EDMBenchmarkBotPanel',
  components: {
    BCard,
    StatsPanelPeriod,
    StatsPanelTable,
  },
  props: {},
  data() {
    return {
      fieldOptions,
      linregressFieldOptions,
      benchmark: 'BAB0',
    }
  },

  computed: {
    ...mapState({
      startTime(state) {
        return state.edm[this.benchmark].startTime
      },
      endTime(state) {
        return state.edm[this.benchmark].endTime
      },
      data(state) {
        return state.edm[this.benchmark].data
      },
      reflectors(state) {
        return state.edm[this.benchmark].reflectors
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
  watch: {
    $route(to, from) {
      const { benchmark } = to.params
      this.benchmark = benchmark
    },
  },
  mounted() {
    const { benchmark } = this.$router.currentRoute.params
    this.benchmark = benchmark
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

<style lang="scss" scoped>
@media (min-width: 991.98px) {
  .bot-panel {
    display: none;
  }
}
</style>
