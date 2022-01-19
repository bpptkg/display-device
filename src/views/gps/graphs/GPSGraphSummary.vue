<template>
  <div>
    <div class="d-flex align-items-center flex-wrap">
      <div>
        <label for="datepicker-sm">Date offset</label>
        <BFormDatepicker
          size="sm"
          class="offset-date-picker"
          v-model="offset"
          locale="en"
          :date-format-options="dateFormatOptions"
        />
      </div>
      <div class="ml-2">
        <label for="rangeselector-sm">Period</label>
        <RangeSelector
          ref="range-selector"
          size="sm"
          hide-period-label
          :selected="period"
          :items="rangeSelector"
          @period-selected="onPeriodChange"
        />
      </div>
    </div>
    <div class="mt-3 gps-graphs-summary">
      <GPSGraph
        class="column"
        base-namespace="summary"
        graph="baseline"
        hide-range-selector
      />
      <GPSGraph
        class="column"
        base-namespace="summary"
        graph="modeling"
        hide-range-selector
      />
      <GPSGraph
        class="column"
        base-namespace="summary"
        graph="modeltime"
        hide-range-selector
      />
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { BFormDatepicker } from 'bootstrap-vue'
import { mapActions, mapMutations, mapState } from 'vuex'

import RangeSelector from '@/components/range-selector'
import rangeSelector from '@/store/gps/graphs/range-selector'

import { SET_PERIOD } from '@/store/base/mutations'
import { UPDATE_IMAGE } from '@/store/gps/graphs/actions'
import { SET_OFFSET } from '@/store/gps/graphs/mutations'

import GPSGraph from './GPSGraph.vue'

export default {
  name: 'GPSGraphSummary',
  components: {
    GPSGraph,
    BFormDatepicker,
    RangeSelector,
  },
  data() {
    return {
      rangeSelector,
      offset: moment().format('YYYY-MM-DD'),
      dateFormatOptions: {
        year: '2-digit',
        month: '2-digit',
        date: '2-digit',
      },
    }
  },
  computed: {
    ...mapState({
      period(state) {
        return state.gps.graphs.summary.baseline.period
      },
    }),
  },
  watch: {
    offset(value) {
      this.setOffset('baseline', moment(this.offset))
      this.setOffset('modeling', moment(this.offset))
      this.setOffset('modeltime', moment(this.offset))
      this.update()
    },
  },
  methods: {
    ...mapMutations({
      setPeriod(commit, namespace, period) {
        return commit(
          'gps/graphs/summary/' + namespace + '/' + SET_PERIOD,
          period
        )
      },
      setOffset(commit, namespace, offset) {
        return commit(
          'gps/graphs/summary/' + namespace + '/' + SET_OFFSET,
          offset
        )
      },
    }),
    ...mapActions({
      updateImage(dispatch, namespace) {
        return dispatch('gps/graphs/summary/' + namespace + '/' + UPDATE_IMAGE)
      },
    }),
    onPeriodChange(period, _) {
      this.setPeriod('baseline', period)
      this.setPeriod('modeling', period)
      this.setPeriod('modeltime', period)
      this.update()
    },
    update() {
      this.updateImage('baseline')
      this.updateImage('modeling')
      this.updateImage('modeltime')
    },
  },
}
</script>

<style lang="scss" scoped>
.offset-date-picker {
  width: fit-content;
}

.gps-graphs-summary {
  display: flex;
  top: 35px;
  width: 100%;
}

.column {
  flex: 33%;
}

@media (max-width: 991.98px) {
  .gps-graphs-summary {
    position: static;
    display: block;
  }
}
</style>
