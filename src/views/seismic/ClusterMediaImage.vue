<template>
  <div>
    <BOverlay :show="isFetching">
      <img
        v-if="isAvailable"
        :src="imgSrc"
        alt="Cluster match plot"
        class="w-100"
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
</template>

<script>
import { BOverlay } from 'bootstrap-vue'
import { buildClusterMediaParentLink } from '@/utils/bulletin'
import { ApiKeyBasedClient as client } from '@/utils/client'
import ErrorMessage from '@/components/error-message'

const noop = (_) => {}

export default {
  name: 'ClusterMediaImage',
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
      isFetching: false,
      isAvailable: false,
      imgSrc: '#',
    }
  },
  async mounted() {
    this.fetchImage()
  },
  methods: {
    async fetchImage() {
      const mediaURL = buildClusterMediaParentLink(this.eventId) + '/match.png'
      this.isFetching = true

      client
        .get(mediaURL, {
          responseType: 'arraybuffer',
        })
        .then((response) => {
          this.isAvailable = true
          const data = Buffer.from(response.data, 'binary').toString('base64')
          this.imgSrc = `data:image/png;base64,${data}`
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
