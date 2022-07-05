<template>
  <div class="bot-panel mt-3">
    <BCard title="Rainfall Information" title-tag="h6">
      <RainfallStationInfo />
    </BCard>
  </div>
</template>

<script>
import { BCard } from 'bootstrap-vue'
import RainfallStationInfo from './RainfallStationInfo'

export default {
  name: 'RainfallStationInfoBotPanel',
  components: {
    RainfallStationInfo,
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
