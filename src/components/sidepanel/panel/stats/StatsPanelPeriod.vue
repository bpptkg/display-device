<template>
  <div>
    <SidepanelListHeader v-if="!noTitle">
      {{ title }}
    </SidepanelListHeader>
    <SidepanelListItem>
      <div class="label label-title">
        {{ durationLabel }}
      </div>
      <div class="label">
        {{ duration }}
      </div>
      <div class="label label-title mt-2">
        {{ startLabel }}
      </div>
      <div class="label">
        {{ startFormatted }}
      </div>
      <div class="label label-title mt-2">
        {{ endLabel }}
      </div>
      <div class="label">
        {{ endFormatted }}
      </div>
    </SidepanelListItem>
  </div>
</template>

<script>
import periodMixin from '../../../mixins/period'
import SidepanelListHeader from '../../SidepanelListHeader'
import SidepanelListItem from '../../SidepanelListItem'

export default {
  name: 'StartPanelPeriod',
  components: {
    SidepanelListHeader,
    SidepanelListItem,
  },
  mixins: [periodMixin],
}
</script>

<style lang="scss" scoped>
.label {
  font-size: 12px;
  word-wrap: break-word;
  word-break: break-word;
  overflow-wrap: break-word;
  color: #202124;

  &.label-title {
    color: #5f6368;
  }
}
</style>
