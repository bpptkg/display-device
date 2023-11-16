<template>
  <div class="graph-container">
    <div v-if="error">
      <ErrorMessage>
        <div v-if="is404Error(error)">
          <p>Graph is not available.</p>
        </div>
        <div v-else>
          <p>Unable to load the graph.</p>
          <p>Error: {{ error.message }}</p>
          <p>
            <BLink @click="update"> Try again </BLink>
          </p>
        </div>
      </ErrorMessage>
    </div>

    <div class="text-center spin-container" v-else-if="isLoading">
      <BSpinner label="Spinning"></BSpinner>
    </div>
    <img v-else :src="src" class="graph-img" />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { BSpinner, BLink } from 'bootstrap-vue'
import ErrorMessage from '@/components/error-message'
import { UPDATE_IMAGE } from '@/store/gps/graphs/actions'

const NAMESPACE = 'realtime/deformation/webobs'

export default {
  name: 'WebobsChart',
  components: {
    ErrorMessage,
    BSpinner,
    BLink,
  },
  computed: {
    ...mapState({
      ...mapState(NAMESPACE, {
        error: (state) => state.error,
        isLoading: (state) => state.isLoading,
        src: (state) => state.src,
      }),
    }),
  },
  mounted() {
    this.update()
  },
  methods: {
    ...mapActions({
      updateImage(dispatch) {
        return dispatch(NAMESPACE + '/' + UPDATE_IMAGE)
      },
    }),
    update() {
      this.updateImage()
    },
    is404Error(error) {
      if (error instanceof Error) {
        return error.response ? error.response.status === 404 : false
      } else {
        return false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.graph-container {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
}
.graph-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
</style>
