<template>
  <BDropdown
    split
    size="sm"
    variant="outline-secondary"
    @click="downloadCurrent"
  >
    <template #button-content>
      Download
      <InfoIcon
        v-b-tooltip.hover
        size="sm"
        title="Download current data in the table."
      />
    </template>

    <BDropdownItem @click="downloadManual">
      Download Data (Manual)
      <InfoIcon
        v-b-tooltip.hover
        size="sm"
        title="Download plottable events with hypocenter manual mode. 
        Non locatable events may also included."
      />
    </BDropdownItem>

    <BDropdownItem @click="downloadAutomatic">
      Download Data (Automatic)
      <InfoIcon
        v-b-tooltip.hover
        size="sm"
        title="Download plottable events with hypocenter automatic mode."
      />
    </BDropdownItem>

    <BDropdownItem @click="downloadRaw">
      Download Raw Data
      <InfoIcon
        v-b-tooltip.hover
        size="sm"
        title="Download raw hypocenter data."
      />
    </BDropdownItem>
  </BDropdown>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { BDropdown, BDropdownItem, VBTooltip } from 'bootstrap-vue'
import { saveAs } from '@/lib/file-saver'
import { createShortNameFromPeriod } from '@/utils/bulletin'
import { InfoIcon } from '@/components/icons/action'
import { NAMESPACE } from '@/store/seismic/hypocenter'

export default {
  name: 'HypocenterTableDownloader',
  components: {
    BDropdown,
    BDropdownItem,
    InfoIcon,
  },
  directives: {
    'b-tooltip': VBTooltip,
  },
  computed: {
    ...mapState(NAMESPACE, {
      data: (state) => state.data,
      period: (state) => state.period,
      settings: (state) => state.settings,
    }),
    ...mapGetters(NAMESPACE, [
      'plottableEvents',
      'locatableEvents',
      'btbbEvents',
      'btbbEventsUnfiltered',
    ]),
    eventData() {
      return this.settings.useBtbbHypo
        ? this.btbbEvents
        : this.settings.onlyLocatable
        ? this.locatableEvents
        : this.plottableEvents
    },
  },
  methods: {
    async downloadCurrent() {
      const blob = new Blob([JSON.stringify(this.eventData)], {
        type: 'application/json;charset=utf-8',
      })
      saveAs(
        blob,
        `hypo-current-${createShortNameFromPeriod(this.period)}.json`
      )
    },

    async downloadManual() {
      const blob = new Blob([JSON.stringify(this.plottableEvents)], {
        type: 'application/json;charset=utf-8',
      })
      saveAs(blob, `hypo-manual-${createShortNameFromPeriod(this.period)}.json`)
    },

    async downloadAutomatic() {
      const blob = new Blob([JSON.stringify(this.btbbEventsUnfiltered)], {
        type: 'application/json;charset=utf-8',
      })
      saveAs(
        blob,
        `hypo-automatic-${createShortNameFromPeriod(this.period)}.json`
      )
    },

    async downloadRaw() {
      const blob = new Blob([JSON.stringify(this.data)], {
        type: 'application/json;charset=utf-8',
      })
      saveAs(blob, `hypo-raw-${createShortNameFromPeriod(this.period)}.json`)
    },
  },
}
</script>
