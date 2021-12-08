<template>
  <div>
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
      <div class="text-center p-4" v-if="!settled">
        <BSpinner label="Spinning"></BSpinner>
      </div>
      <img v-else :src="src" alt="Helicorder" class="helicorder" />
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

const NAMESPACE = `home/charts/helicorder/${HelicorderChannel.PASB_BHZ_MP_10}`

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
  mounted() {
    this.interval = setInterval(this.updateImage, 10000)
    this.updateImage()
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
  },
}
</script>

<style lang="scss" scoped>
.helicorder {
  width: 100%;
  height: 100%;
}
</style>
