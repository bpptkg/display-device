<template>
  <div ref="helicorder" class="helicorder">
    <ErrorMessage v-if="error">
      <p>Unable to load the image.</p>
      <p>Error: {{ error.message }}</p>
      <p>
        <BLink @click="update"> Try again </BLink>
      </p>
    </ErrorMessage>
    <div class="text-center spin-container" v-else-if="!settled">
      <BSpinner label="Spinning"></BSpinner>
    </div>
    <img v-else :src="src" :alt="code" class="helicorder" />
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { BSpinner, BLink } from 'bootstrap-vue'
import ErrorMessage from '@/components/error-message'
import EventBus from '@/utils/event-bus'
import {
  validateWidth,
  validateHeight,
  calculateInterval,
} from '@/utils/helicorder'
import { UPDATE_IMAGE } from '@/store/helicorder/actions'
import { SET_CODE, SET_OPTIONS } from '@/store/helicorder/mutations'
import { SET_SETTLED } from '@/store/helicorder/mutations'
import { EVENT_PERIOD_UPDATED } from '@/constants/events/helicorder'
import { isRelativePeriod } from '@/store/helicorder'

const NAMESPACE = 'helicorder'

export default {
  name: 'Helicorder',
  components: {
    BSpinner,
    BLink,
    ErrorMessage,
  },
  props: {
    code: {
      type: String,
      required: true,
    },
    autoRefresh: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      interval: null,
    }
  },
  computed: {
    ...mapState({
      src(state) {
        return state.helicorder[this.code].src
      },
      settled(state) {
        return state.helicorder[this.code].settled
      },
      error(state) {
        return state.helicorder[this.code].error
      },
      period(state) {
        return state.helicorder[this.code].period
      },
      startTime(state) {
        return state.helicorder[this.code].startTime
      },
      endTime(state) {
        return state.helicorder[this.code].endTime
      },
    }),

    namespace() {
      return `${NAMESPACE}/${this.code}`
    },
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
    this.setCode(this.code)

    this.$nextTick(() => {
      this.resizeAndUpdate()

      if (this.autoRefresh) {
        this.interval = setInterval(
          this.updateImage,
          calculateInterval(this.startTime, this.endTime)
        )
      }
    })

    EventBus.$on(EVENT_PERIOD_UPDATED, () => {
      this.setSettled(false)

      // Clear previous interval.
      if (this.interval) {
        clearInterval(this.interval)
      }
      if (isRelativePeriod(this.period)) {
        this.interval = setInterval(
          this.updateImage,
          calculateInterval(this.startTime, this.endTime)
        )
      }
      this.updateImage()
    })

    window.addEventListener('resize', this.onWindowResize)
  },
  methods: {
    ...mapMutations({
      setOptions(commit, options) {
        return commit(this.namespace + '/' + SET_OPTIONS, options)
      },
      setCode(commit, code) {
        return commit(this.namespace + '/' + SET_CODE, code)
      },
      setSettled(commit, value) {
        return commit(this.namespace + '/' + SET_SETTLED, value)
      },
    }),
    ...mapActions({
      updateImage(dispatch) {
        return dispatch(this.namespace + '/' + UPDATE_IMAGE)
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
.helicorder {
  height: 100%;
  width: 100%;
}

.spin-container {
  min-height: 350px;
}
</style>
