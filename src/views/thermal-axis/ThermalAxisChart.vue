<template>
  <div>
    <ThermalAxisKalChart v-if="station === 'kaliurang'" />
    <ThermalAxisJrgChart v-else-if="station === 'jurangjero'" />
    <ThermalAxisDelChart v-else-if="station === 'deles'" />
  </div>
</template>

<script>
import ThermalAxisKalChart from './ThermalAxisKalChart.vue'
import ThermalAxisJrgChart from './ThermalAxisJrgChart.vue'
import ThermalAxisDelChart from './ThermalAxisDelChart.vue'

export default {
  components: {
    ThermalAxisKalChart,
    ThermalAxisJrgChart,
    ThermalAxisDelChart,
  },
  props: {
    station: {
      type: String,
      required: true,
    },
  },
}
</script>
