<template>
  <div>
    <div v-for="(img, index) in images" :key="index">
      <BOverlay :show="isFetching">
        <img
          v-if="isAvailable"
          :src="img.src"
          alt="Cluster match plot"
          class="w-100 img"
        />
        <div
          v-else
          class="d-flex align-items-center justify-content-center"
          style="height: 300px"
        >
          <ErrorMessage> Cluster match plot is not available. </ErrorMessage>
        </div>
      </BOverlay>
    </div>

    <div
      v-if="images.length == 0"
      class="d-flex align-items-center justify-content-center"
      style="height: 300px"
    >
      <ErrorMessage> Cluster match plot is not available. </ErrorMessage>
    </div>
  </div>
</template>

<script>
import { BOverlay } from 'bootstrap-vue'
import { buildClusterMediaParentLink } from '@/utils/bulletin'
import { ApiKeyBasedClient as client } from '@/utils/client'
import ErrorMessage from '@/components/error-message'

const noop = (_) => {}

export default {
  name: 'ClusterMediaImageViewer',
  components: {
    BOverlay,
    ErrorMessage,
  },
  props: {
    eventId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      options: {
        rotatable: false,
        movable: true,
        scalable: false,
      },
      isFetching: false,
      isAvailable: false,
      images: [],
    }
  },
  mounted() {
    this.fetchImage()
  },
  methods: {
    inited(viewer) {
      this.$viewer = viewer
    },
    fetchImage() {
      const mediaURL = buildClusterMediaParentLink(this.eventId) + '/match.png'
      this.isFetching = true

      client
        .get(mediaURL, {
          responseType: 'arraybuffer',
        })
        .then((response) => {
          this.isAvailable = true
          const data = Buffer.from(response.data, 'binary').toString('base64')
          this.images = [
            {
              src: `data:image/png;base64,${data}`,
            },
          ]
        })
        .catch((error) => {
          this.isAvailable = false
          noop(error)
        })
        .finally(() => {
          this.isFetching = false
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.img {
  cursor: pointer;
}
</style>
