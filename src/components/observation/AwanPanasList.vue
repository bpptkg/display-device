<template>
  <div>
    <BCard v-for="(event, index) in events" :key="index" class="mt-2 mb-2">
      <BRow class="mt-3">
        <BCol sm="6" lg="2" class="mb-1">
          <div class="label">Waktu</div>
          <div>
            {{ valueFormatter(event.occured_at) }}
          </div>
        </BCol>

        <BCol sm="6" lg="2" class="mb-1">
          <div class="label">Ukuran</div>
          <div>
            {{ valueFormatter(event.size) }}
          </div>
        </BCol>

        <BCol sm="6" lg="2" class="mb-1">
          <div class="label">Jarak</div>
          <div class="value">
            {{ distanceFormatter(event.distance, { unit: 'km' }) }}
          </div>
        </BCol>

        <BCol sm="6" lg="2" class="mb-1">
          <div class="label">Arah</div>
          <div>{{ directionFormatter(event.direction) }}</div>
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
  name: 'AwanPanasList',
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
