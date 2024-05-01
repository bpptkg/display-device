<template>
  <div ref="rsam" class="rsam-container">
    <ErrorMessage v-if="error">
      <p>Unable to load the image.</p>
      <p>Error: {{ error.message }}</p>
      <p>We will refresh the chart automatically when network available.</p>
      <p>
        <BLink @click="update"> Try again </BLink>
      </p>
    </ErrorMessage>

    <div
      class="d-flex align-items-center justify-content-center h-100"
      v-if="!settled"
    >
      <BSpinner label="Spinning"></BSpinner>
    </div>
    <img v-else :src="src" alt="RSAM" class="rsam" />
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { BLink, BSpinner } from 'bootstrap-vue'
import ErrorMessage from '@/components/error-message'
import { HelicorderChannel } from '@/store/helicorder'
import { SET_OPTIONS, SET_SETTLED, UPDATE_IMAGE } from '@/store/rsam'
import { validateWidth, validateHeight } from '@/utils/helicorder'

const NAMESPACE = `realtime/seismic/rsam`

export default {
  name: 'RSAMChart',
  components: {
    BLink,
    BSpinner,
    ErrorMessage,
  },
  computed: {
    ...mapState(NAMESPACE, {
      error: (state) => state.error,
      src: (state) => state.src,
      settled: (state) => state.settled,
    }),
  },
  data() {
    return {
      interval: null,
    }
  },
  beforeDestroy() {
    if (this.interval) {
      clearInterval(this.interval)
    }
  },
  destroyed() {
    window.removeEventListener('resize', this.onWindowResize)
  },
  mounted() {
    this.$nextTick(() => {
      this.resizeAndUpdate()
      this.interval = setInterval(this.updateImage, 30 * 1000)
    })
    window.addEventListener('resize', this.onWindowResize)
  },
  methods: {
    ...mapMutations({
      setOptions(commit, options) {
        return commit(NAMESPACE + '/' + SET_OPTIONS, options)
      },
      setSettled(commit, value) {
        return commit(NAMESPACE + '/' + SET_SETTLED, value)
      },
    }),
    ...mapActions({
      updateImage(dispatch) {
        return dispatch(NAMESPACE + '/' + UPDATE_IMAGE)
      },
    }),
    update() {
      this.updateImage()
    },
    resizeAndUpdate() {
      const width = this.$refs.rsam.offsetWidth
      const height = this.$refs.rsam.offsetHeight
      const options = {
        w: validateWidth(width),
        h: validateHeight(width, height),
      }

      this.setOptions(options)
      this.updateImage()
    },
    onWindowResize() {
      this.$nextTick(this.resizeAndUpdate)
    },
  },
}
</script>

<style lang="scss" scoped>
.rsam-container {
  width: 100%;
  height: 100%;
}

.rsam {
  width: 100%;
  height: 100%;
}
</style>
