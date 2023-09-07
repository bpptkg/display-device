<template>
  <div class="view">
    <div class="d-flex w-100">
      <div class="d-flex w-100 justify-content-between align-items-center ml-2">
        <RangeSelector
          ref="range-selector"
          size="sm"
          custom-enabled
          :selected="period"
          :items="rangeSelector"
          :max-custom-duration="maxCustomDuration"
          @period-selected="onPeriodChange"
        />
        <div class="d-flex">
          <BFormSelect
            v-model="channel1"
            :options="helicorderChannels"
            size="sm"
            class="w-auto"
          ></BFormSelect>
          <DButtonIcon
            :icon="SidebarLeftIcon"
            @click.native="toggleCode1Visibility"
            v-b-tooltip.hover
            title="Toogle left side visibility"
            class="ml-1"
          ></DButtonIcon>
        </div>
      </div>
      <div class="d-flex w-100 justify-content-end align-items-center mr-2">
        <BFormSelect
          v-model="channel2"
          :options="helicorderChannels"
          size="sm"
          class="w-auto"
        ></BFormSelect>
        <DButtonIcon
          :icon="SidebarRightIcon"
          @click.native="toggleCode2Visibility"
          v-b-tooltip.hover
          title="Toogle right side visibility"
          class="ml-1"
        ></DButtonIcon>
      </div>
    </div>
    <div class="wrapper">
      <Helicorder
        v-if="code1Visible"
        class="column"
        :code="code1"
        auto-refresh
      />
      <Helicorder
        v-if="code2Visible"
        class="column"
        :code="code2"
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
import {
  SET_CODE1,
  SET_CODE2,
  SET_CODE1_VISIBILITY,
  SET_CODE2_VISIBILITY,
} from '@/store/helicorder/mutations'
import { DateRangeTypes } from '@/constants/date'
import { EVENT_PERIOD_UPDATED } from '@/constants/events/helicorder'
import { BFormSelect, VBHover, VBTooltip } from 'bootstrap-vue'
import DButtonIcon from '../../components/base/button-icon/DButtonIcon.vue'
import { SidebarLeftIcon, SidebarRightIcon } from '../../components/icons'

export default {
  name: 'HelicorderView',
  components: {
    Helicorder,
    RangeSelector,
    BFormSelect,
    DButtonIcon,
  },
  directives: {
    'b-hover': VBHover,
    'b-tooltip': VBTooltip,
  },
  data() {
    return {
      rangeSelector,
      maxCustomDuration,
      SidebarLeftIcon,
      SidebarRightIcon,
    }
  },
  computed: {
    namespace() {
      return 'helicorder'
    },
    ...mapState({
      period(state) {
        return state.helicorder[defaultChannel].period
      },
      channels(state) {
        return state.helicorder.channels
      },
      helicorderChannels(state) {
        return state.helicorder.helicorderChannels
      },
      code1(state) {
        return state.helicorder.code1
      },
      code2(state) {
        return state.helicorder.code2
      },
      code1Visible(state) {
        return state.helicorder.code1Visible
      },
      code2Visible(state) {
        return state.helicorder.code2Visible
      },
    }),
    channel1: {
      get() {
        return this.code1
      },
      set(value) {
        this.setCode1(value)
      },
    },
    channel2: {
      get() {
        return this.code2
      },
      set(value) {
        this.setCode2(value)
      },
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
      setCode1(commit, code) {
        return commit(this.namespace + '/' + SET_CODE1, code)
      },
      setCode2(commit, code) {
        return commit(this.namespace + '/' + SET_CODE2, code)
      },
      setCode1Visibility(commit, value) {
        return commit(this.namespace + '/' + SET_CODE1_VISIBILITY, value)
      },
      setCode2Visibility(commit, value) {
        return commit(this.namespace + '/' + SET_CODE2_VISIBILITY, value)
      },
    }),
    createNamespace(code) {
      return `helicorder/${code}`
    },
    onPeriodChange(period, { startTime, endTime }) {
      const channels = [this.code1, this.code2]
      if (period.type === DateRangeTypes.CUSTOM) {
        channels.forEach((code) => {
          this.setPeriod(this.createNamespace(code), period)
          this.setStartTime(this.createNamespace(code), startTime)
          this.setEndTime(this.createNamespace(code), endTime)
        })
      } else {
        channels.forEach((code) => {
          this.setPeriod(this.createNamespace(code), period)
        })
      }
      EventBus.$emit(EVENT_PERIOD_UPDATED)
    },
    toggleCode1Visibility() {
      this.setCode1Visibility(!this.code1Visible)
    },
    toggleCode2Visibility() {
      this.setCode2Visibility(!this.code2Visible)
    },
  },
}
</script>

<style lang="scss" scoped>
.view {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 55px;
}

.wrapper {
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

.toolbar {
  display: flex;
}

@media (max-width: 991.98px) {
  .wrapper {
    position: static;
    display: block;
  }
}
</style>
