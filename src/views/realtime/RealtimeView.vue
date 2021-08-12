<template>
  <DisplayRoot>
    <DisplayBanner />
    <DisplayCollection :items="items" />
  </DisplayRoot>
</template>

<script>
import {
  DisplayBanner,
  DisplayCollection,
  DisplayRoot,
} from '@/components/realtime'

export default {
  name: 'RealtimeView',
  components: {
    DisplayBanner,
    DisplayCollection,
    DisplayRoot,
  },
  data() {
    return {
      items: [
        {
          to: '/realtime/seismic',
          title: 'Seismic',
          imgSrc: '/images/display-device/seismic.png',
        },
      ],
    }
  },
}
</script>
