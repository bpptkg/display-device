<template>
  <LavaDomeChartView :location="location" />
</template>

<script>
import { LavaDome } from '@/constants/lava-domes'
import LavaDomeChartView from './LavaDomeChartView'

export default {
  name: 'LavaDomeSouthwestView',
  components: {
    LavaDomeChartView,
  },
  data() {
    return {
      location: LavaDome.DOME_SOUTHWEST,
    }
  },
}
</script>
