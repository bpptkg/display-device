<template>
  <div>
    <ThermalAxisKalChart v-if="station === 'kaliurang'" />
    <ThermalAxisJrgChart v-else-if="station === 'jurangjero'" />
    <ThermalAxisDelChart v-else-if="station === 'deles'" />
    <ThermalAxisBbdChart v-else-if="station === 'babadan'" />
  </div>
</template>

<script>
import ThermalAxisKalChart from './ThermalAxisKalChart.vue'
import ThermalAxisJrgChart from './ThermalAxisJrgChart.vue'
import ThermalAxisDelChart from './ThermalAxisDelChart.vue'
import ThermalAxisBbdChart from './ThermalAxisBbdChart.vue'

export default {
  components: {
    ThermalAxisKalChart,
    ThermalAxisJrgChart,
    ThermalAxisDelChart,
    ThermalAxisBbdChart,
  },
  props: {
    station: {
      type: String,
      required: true,
    },
  },
}
</script>
