<template>
  <div ref="helicorder" class="helicorder">
    <ErrorMessage v-if="error">
      <p>Unable to load the image.</p>
      <p>Error: {{ error.message }}</p>
      <p>
        <BLink @click="update"> Try again </BLink>
      </p>
    </ErrorMessage>
    <div class="text-center spin-container" v-if="!settled && !error">
      <BSpinner label="Spinning"></BSpinner>
    </div>
    <img v-else :src="src" :alt="code" class="helicorder" />
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { BSpinner, BLink } from 'bootstrap-vue'
import ErrorMessage from '@/components/error-message'
import { UPDATE_IMAGE } from '@/store/helicorder/actions'
import { SET_CODE, SET_OPTIONS } from '@/store/helicorder/mutations'
import { SET_SETTLED } from '../../store/helicorder/mutations'

const NAMESPACE = 'helicorder'

const MIN_WIDTH = 150
const MIN_HEIGHT = 150
const DEFAULT_HEIGHT = 600

const isMobile = (width) => {
  return width <= 575
}

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
  mounted() {
    this.setCode(this.code)

    this.$nextTick(() => {
      const width = this.$refs.helicorder.offsetWidth
      const height = this.$refs.helicorder.offsetHeight
      const options = {
        w: width >= MIN_WIDTH ? width : MIN_WIDTH,
        h: isMobile(width)
          ? DEFAULT_HEIGHT
          : height >= MIN_HEIGHT
          ? height
          : MIN_HEIGHT,
      }

      this.setOptions(options)
      this.updateImage()
    })

    if (this.autoRefresh) {
      this.interval = setInterval(this.updateImage, 5000)
    }
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
