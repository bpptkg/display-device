<template>
  <div>
    <div v-if="!hideRangeSelector" class="d-flex align-items-center flex-wrap">
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

    <div v-if="error">
      <ErrorMessage>
        <div v-if="is404Error(error)">
          <p>Graph is not available.</p>
        </div>
        <div v-else>
          <p>Unable to load the graph.</p>
          <p>Error: {{ error.message }}</p>
          <p>
            <BLink @click="update"> Try again </BLink>
          </p>
        </div>
      </ErrorMessage>
    </div>

    <div class="text-center spin-container" v-else-if="isLoading">
      <BSpinner label="Spinning"></BSpinner>
    </div>
    <img v-else :src="src" :alt="graph" class="mt-3 graph-img" />
  </div>
</template>

<script>
import moment from 'moment'
import { mapActions, mapMutations, mapState } from 'vuex'
import { BFormDatepicker, BSpinner, BLink } from 'bootstrap-vue'
import ErrorMessage from '@/components/error-message'
import RangeSelector from '@/components/range-selector'
import rangeSelector from '@/store/gps/graphs/range-selector'
import { SET_PERIOD } from '@/store/base/mutations'
import { SET_OFFSET } from '@/store/gps/graphs/mutations'
import { UPDATE_IMAGE } from '@/store/gps/graphs/actions'

export default {
  name: 'GPSGraph',
  components: {
    ErrorMessage,
    RangeSelector,
    BFormDatepicker,
    BSpinner,
    BLink,
  },
  props: {
    graph: {
      type: String,
      required: true,
    },
    hideRangeSelector: {
      type: Boolean,
      default: false,
    },
    baseNamespace: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      rangeSelector,
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
        if (this.baseNamespace) {
          return state.gps.graphs[this.baseNamespace][this.graph].period
        }
        return state.gps.graphs[this.graph].period
      },
      error(state) {
        if (this.baseNamespace) {
          return state.gps.graphs[this.baseNamespace][this.graph].error
        }
        return state.gps.graphs[this.graph].error
      },
      src(state) {
        if (this.baseNamespace) {
          return state.gps.graphs[this.baseNamespace][this.graph].src
        }
        return state.gps.graphs[this.graph].src
      },
      dateOffset(state) {
        if (this.baseNamespace) {
          return state.gps.graphs[this.baseNamespace][this.graph].offset
        }
        return state.gps.graphs[this.graph].offset
      },
      isLoading(state) {
        if (this.baseNamespace) {
          return state.gps.graphs[this.baseNamespace][this.graph].isLoading
        }
        return state.gps.graphs[this.graph].isLoading
      },
    }),
    offset: {
      get() {
        return this.dateOffset.format('YYYY-MM-DD')
      },
      set(value) {
        this.setOffset(moment(value))
      },
    },
    namespace() {
      if (this.baseNamespace) {
        const prefix = this.baseNamespace.endsWith('/')
          ? this.baseNamespace
          : `${this.baseNamespace}/`
        return `gps/graphs/${prefix}${this.graph}`
      }
      return `gps/graphs/${this.graph}`
    },
  },
  watch: {
    offset(_) {
      this.update()
    },
  },
  mounted() {
    this.update()
  },
  methods: {
    ...mapMutations({
      setOffset(commit, offset) {
        return commit(this.namespace + '/' + SET_OFFSET, offset)
      },
      setPeriod(commit, period) {
        return commit(this.namespace + '/' + SET_PERIOD, period)
      },
    }),
    ...mapActions({
      updateImage(dispatch) {
        return dispatch(this.namespace + '/' + UPDATE_IMAGE)
      },
    }),
    onPeriodChange(period, _) {
      this.setPeriod(period)
      this.update()
    },
    update() {
      this.updateImage()
    },
    is404Error(error) {
      if (error instanceof Error) {
        return error.response ? error.response.status === 404 : false
      } else {
        return false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.offset-date-picker {
  width: fit-content;
}

.graph-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
