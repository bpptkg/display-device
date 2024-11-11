<template>
  <div ref="helicorder">
    <BCard v-if="error">
      <ErrorMessage>
        <p>Unable to load the image.</p>
        <p>Error: {{ error.message }}</p>
        <p>
          <BLink @click="update"> Try again </BLink>
        </p>
      </ErrorMessage>
    </BCard>
    <BCard v-show="!error" body-class="p-0">
      <template #header>
        <div class="d-flex justify-content-between">
          <h6>Helicorder</h6>
          <router-link to="/seismic/helicorder">
            <small>See more</small>
          </router-link>
        </div>
      </template>
      <div class="helicorder-container">
        <div
          class="d-flex align-items-center justify-content-center h-100"
          v-if="!settled"
        >
          <BSpinner label="Spinning"></BSpinner>
        </div>
        <img v-else :src="src" alt="Helicorder" class="helicorder" />
      </div>
    </BCard>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { BCard, BLink, BSpinner } from 'bootstrap-vue'
import ErrorMessage from '@/components/error-message'
import { HelicorderChannel } from '@/store/helicorder'
import {
  SET_CODE,
  SET_OPTIONS,
  SET_SETTLED,
} from '@/store/helicorder/mutations'
import { UPDATE_IMAGE } from '@/store/helicorder/actions'
import { validateWidth, validateHeight } from '@/utils/helicorder'

const NAMESPACE = `home/charts/helicorder/${HelicorderChannel.MEPSL_HHZ_VG_00}`

export default {
  name: 'HelicorderChart',
  components: {
    BCard,
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
      this.interval = setInterval(this.updateImage, 10000)
    })
    window.addEventListener('resize', this.onWindowResize)
  },
  methods: {
    ...mapMutations({
      setOptions(commit, options) {
        return commit(NAMESPACE + '/' + SET_OPTIONS, options)
      },
      setCode(commit, code) {
        return commit(NAMESPACE + '/' + SET_CODE, code)
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
      const width = this.$refs.helicorder.offsetWidth
      const height = this.$refs.helicorder.offsetHeight
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
.helicorder-container {
  width: 100%;
  height: 450px;
}

.helicorder {
  width: 100%;
  height: 100%;
}
</style>
