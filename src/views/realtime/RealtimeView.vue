<template>
  <DisplayRoot>
    <DisplayCollection :items="items" />
  </DisplayRoot>
</template>

<script>
import { DisplayCollection, DisplayRoot } from '@/components/realtime'

export default {
  name: 'RealtimeView',
  components: {
    DisplayCollection,
    DisplayRoot,
  },
  data() {
    return {
      items: [
        {
          to: '/realtime/seismic',
          title: 'Seismic',
          imgSrc: `${this.$baseUrl}img/realtime/seismic.png`,
        },
        {
          to: '/realtime/seismic2',
          title: 'Seismic2',
          imgSrc: `${this.$baseUrl}img/realtime/seismic2.png`,
        },
        {
          to: '/realtime/deformation',
          title: 'Deformasi',
          imgSrc: `${this.$baseUrl}img/realtime/deformasi.png`,
        },
      ],
    }
  },
}
</script>
