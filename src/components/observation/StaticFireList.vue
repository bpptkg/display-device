<template>
  <div>
    <BCard v-for="(event, index) in events" :key="index" class="mt-2 mb-2">
      <BRow class="mt-3">
        <BCol sm="6" lg="2" class="mb-1">
          <div class="label">Waktu Mulai</div>
          <div>
            {{ valueFormatter(event.start_time) }}
          </div>
        </BCol>

        <BCol sm="6" lg="2" class="mb-1">
          <div class="label">Waktu Selesai</div>
          <div>
            {{ valueFormatter(event.end_time) }}
          </div>
        </BCol>

        <BCol sm="6" lg="2" class="mb-1">
          <div class="label">Durasi</div>
          <div class="value">
            {{
              durationFormatter(
                calculateDurationFromTime(event.start_time, event.end_time)
              )
            }}
          </div>
        </BCol>

        <BCol sm="6" lg="2" class="mb-1">
          <div class="label">Diamati dari</div>
          <div>{{ stationFormatter(event.station_id) }}</div>
        </BCol>
      </BRow>

      <BRow class="mt-3">
        <BCol>
          <div class="label">Keterangan</div>
          <div>
            {{ valueFormatter(event.remark) }}
          </div>
        </BCol>
      </BRow>
    </BCard>
  </div>
</template>

<script>
import { BRow, BCard, BCol } from 'bootstrap-vue'

import formatterMixin from './mixins/formatter'
import genericMixin from './mixins/generic'

export default {
  name: 'StaticFireList',
  components: {
    BCard,
    BCol,
    BRow,
  },
  mixins: [genericMixin, formatterMixin],
  props: {
    events: {
      type: Array,
      default: () => [],
    },
  },
}
</script>

<style lang="scss" scoped>
.label {
  color: #3c4043;
  font-size: 12px;
}
</style>
