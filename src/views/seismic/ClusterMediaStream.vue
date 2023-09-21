<template>
  <div>
    <BOverlay :show="isFetching">
      <BButton variant="primary" :disabled="!isAvailable" @click="download">
        <span v-if="!isBusy">{{
          isAvailable ? 'Download miniSeed' : 'miniSeed is not available'
        }}</span>
        <span v-else>
          <BSpinner label="Downloading...." />
        </span>
      </BButton>
    </BOverlay>
  </div>
</template>

<script>
import { saveAs } from '@/lib/file-saver'
import { BOverlay, BButton, BSpinner } from 'bootstrap-vue'
import { buildClusterMediaParentLink } from '@/utils/bulletin'
import { ApiKeyBasedClient as client } from '@/utils/client'

const noop = (_) => {}

export default {
  name: 'ClusterMediaStream',
  components: {
    BOverlay,
    BButton,
    BSpinner,
  },
  props: {
    eventId: {
      type: String,
      default: '',
    },
    filename: {
      type: String,
      default: 'stream.msd',
    },
  },
  data() {
    return {
      isFetching: false,
      isAvailable: false,
      isBusy: false,
      stream: '',
    }
  },
  async mounted() {
    this.fetchMsd()
  },
  methods: {
    async fetchMsd() {
      const mediaURL = buildClusterMediaParentLink(this.eventId) + '/stream.msd'
      this.isFetching = true

      client
        .get(mediaURL, {
          responseType: 'arraybuffer',
        })
        .then((response) => {
          this.isAvailable = true
          this.stream = new Blob([response.data])
        })
        .catch((error) => {
          this.isAvailable = false
          noop(error)
        })
        .finally(() => {
          this.isFetching = false
        })
    },
    async download() {
      this.isBusy = true
      saveAs(window.URL.createObjectURL(this.stream), this.filename)
      this.isBusy = false
    },
  },
}
</script>
