<template>
  <div>
    <BCard v-for="(event, index) in events" :key="index" class="mt-2 mb-2">
      <BRow v-if="event.with_pyroclastic_flow">
        <BCol>
          <BBadge variant="danger" pill> Disertai Awan Panas </BBadge>
        </BCol>
      </BRow>

      <BRow class="mt-3">
        <BCol sm="6" lg="2" class="mb-1">
          <div class="label">Waktu</div>
          <div>
            {{ valueFormatter(event.occurred_at) }}
          </div>
        </BCol>

        <BCol sm="6" lg="2" class="mb-1">
          <div class="label">Durasi</div>
          <div>
            {{ durationFormatter(event.duration) }}
          </div>
        </BCol>

        <BCol sm="6" lg="2" class="mb-1">
          <div class="label">Tinggi Kolom</div>
          <div class="value">
            {{ distanceFormatter(event.column_height, { unit: 'km' }) }}
          </div>
        </BCol>

        <BCol sm="6" lg="2" class="mb-1">
          <div class="label">Warna Kolom</div>
          <div>{{ columnColorFormatter(event.column_color) }}</div>
        </BCol>

        <BCol sm="6" lg="2" class="mb-1">
          <div class="label">Arah Angin</div>
          <div>{{ windDirectionFormatter(event.wind_direction) }}</div>
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

      <BRow v-if="event.attachments.length" class="mt-3">
        <BCol>
          <div class="label">Foto</div>
          <ImageViewer :images="getImagesFromAttachments(event.attachments)" />
        </BCol>
      </BRow>
    </BCard>
  </div>
</template>

<script>
import { BRow, BCard, BCol, BBadge } from 'bootstrap-vue'

import ImageViewer from './ImageViewer'
import formatterMixin from './mixins/formatter'
import genericMixin from './mixins/generic'

export default {
  name: 'ExplosionList',
  components: {
    BBadge,
    BCard,
    BCol,
    BRow,
    ImageViewer,
  },
  mixins: [formatterMixin, genericMixin],
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
