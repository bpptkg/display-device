<template>
  <BCard header="Hypocenter Information">
    <BRow>
      <BCol sm="6" class="mb-2">
        <div>
          <span class="font-weight-bold">Total</span>
          <InfoIcon v-b-tooltip.hover size="sm" :title="totalHelp" />
        </div>
        <div>{{ numTotal }}</div>
      </BCol>
      <BCol sm="6" class="mb-2">
        <div>
          <span class="font-weight-bold">Currently Plotted</span>
          <InfoIcon v-b-tooltip.hover size="sm" :title="currentlyPlottedHelp" />
        </div>
        <div>{{ numCurrentlyPlottedFormatted }}</div>
      </BCol>
      <BCol sm="6" class="mb-2">
        <div>
          <span class="font-weight-bold">Start Time</span>
        </div>
        <div>{{ startTime }}</div>
      </BCol>
      <BCol sm="6" class="mb-2">
        <div>
          <span class="font-weight-bold">End Time</span>
        </div>
        <div>{{ endTime }}</div>
      </BCol>
    </BRow>
  </BCard>
</template>

<script>
import { BCard, BRow, BCol, VBTooltip } from 'bootstrap-vue'
import { InfoIcon } from '@/components/icons/action'
import { DATETIME_FORMAT } from '@/constants/date'
import { NO_DATA_NOTATION } from '@/constants/stats'

export default {
  name: 'HypocenterTableStats',
  components: {
    BCard,
    BCol,
    BRow,
    InfoIcon,
  },
  directives: {
    'b-tooltip': VBTooltip,
  },
  props: {
    eventInfo: {
      type: Object,
      default: function () {
        return {}
      },
    },
  },
  data() {
    return {
      totalHelp: `Total number of plottable events for current hypocenter 
      mode.`,
      currentlyPlottedHelp: `Total number of currently plotted events
      as shown in the chart.`,
    }
  },
  computed: {
    numTotal() {
      return this.eventInfo.plottableEvents
        ? this.eventInfo.plottableEvents.length
        : 0
    },
    numCurrentlyPlottedFormatted() {
      const total = this.eventInfo.plottableEvents
        ? this.eventInfo.plottableEvents.length
        : 1
      const currentlyPlotted = this.eventInfo.currentlyPlotted
        ? this.eventInfo.currentlyPlotted.length
        : 0

      const percent = (currentlyPlotted / total) * 100

      return currentlyPlotted !== 0
        ? `${currentlyPlotted} (${percent.toFixed(1)}%)`
        : 0
    },
    startTime() {
      return this.eventInfo.startTime
        ? this.eventInfo.startTime.format(DATETIME_FORMAT)
        : NO_DATA_NOTATION
    },
    endTime() {
      return this.eventInfo.endTime
        ? this.eventInfo.endTime.format(DATETIME_FORMAT)
        : NO_DATA_NOTATION
    },
  },
}
</script>
