<template>
  <div class="wrapper">
    <div class="d-flex align-items-center mb-1 ml-1">
      <RangeSelector
        ref="range-selector"
        size="sm"
        custom-enabled
        :selected="period"
        :items="rangeSelector"
        :max-custom-duration="maxCustomDuration"
        @period-selected="onPeriodChange"
      />
    </div>
    <div class="helicorder-wrapper">
      <Helicorder
        v-for="code in channels"
        :key="code"
        class="column"
        :code="code"
        auto-refresh
      />
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import Helicorder from '@/views/helicorder/Helicorder'
import RangeSelector from '@/components/range-selector'
import rangeSelector, {
  maxCustomDuration,
} from '@/store/helicorder/range-selector'
import EventBus from '@/utils/event-bus'
import { defaultChannel } from '@/store/helicorder'
import {
  SET_END_TIME,
  SET_PERIOD,
  SET_START_TIME,
} from '@/store/base/mutations'
import { DateRangeTypes } from '@/constants/date'
import { EVENT_PERIOD_UPDATED } from '@/constants/events/helicorder'

export default {
  name: 'HelicorderView',
  components: {
    Helicorder,
    RangeSelector,
  },
  data() {
    return {
      rangeSelector,
      maxCustomDuration,
    }
  },
  computed: {
    ...mapState({
      period(state) {
        return state.helicorder[defaultChannel].period
      },
      channels(state) {
        return state.helicorder.channels
      },
    }),
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
    }),
    createNamespace(code) {
      return `helicorder/${code}`
    },
    onPeriodChange(period, { startTime, endTime }) {
      if (period.type === DateRangeTypes.CUSTOM) {
        this.channels.forEach((code) => {
          this.setPeriod(this.createNamespace(code), period)
          this.setStartTime(this.createNamespace(code), startTime)
          this.setEndTime(this.createNamespace(code), endTime)
        })
      } else {
        this.channels.forEach((code) => {
          this.setPeriod(this.createNamespace(code), period)
        })
      }
      EventBus.$emit(EVENT_PERIOD_UPDATED)
    },
  },
}
</script>

<style lang="scss" scoped>
.wrapper {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 55px;
}

.helicorder-wrapper {
  display: flex;
  flex-wrap: wrap;
  position: absolute;
  top: 35px;
  bottom: 0;
  left: 0;
  right: 0;
}

.column {
  flex: 50%;
}

@media (max-width: 767px) {
  .helicorder-wrapper {
    position: static;
    display: block;
    margin-top: 50px;
  }
}
</style>
