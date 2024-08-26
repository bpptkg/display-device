<template>
  <div>
    <ThermalAxisKalChart v-if="station === 'kaliurang'" />
    <ThermalAxisJrgChart v-else-if="station === 'jurangjero'" />
  </div>
</template>

<script>
import ThermalAxisKalChart from './ThermalAxisKalChart.vue'
import ThermalAxisJrgChart from './ThermalAxisJrgChart.vue'

export default {
  components: {
    ThermalAxisKalChart,
    ThermalAxisJrgChart,
  },
  props: {
    station: {
      type: String,
      required: true,
    },
  },
}
</script>
