<template>
  <div class="bot-panel mt-3">
    <BCard title="Rainfall Information" title-tag="h6">
      <RainfallDailyInfo />
    </BCard>
  </div>
</template>

<script>
import { BCard } from 'bootstrap-vue'
import RainfallDailyInfo from './RainfallDailyInfo.vue'

export default {
  name: 'RainfallStationInfoBottomPanel',
  components: {
    RainfallDailyInfo,
    BCard,
  },
}
</script>

<style lang="scss" scoped>
@media (min-width: 991.98px) {
  .bot-panel {
    display: none;
  }
}
</style>
