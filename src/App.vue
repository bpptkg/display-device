<template>
  <div>
    <ProgressBar />
    <TheTopNavbar />
    <router-view></router-view>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import ProgressBar from './components/progressbar/ProgressBar'
import TheTopNavbar from './components/TheTopNavbar'
import { NAMESPACE } from './store/version'
import {
  SET_REFRESHING,
  SET_REGISTRATION,
  SET_UPDATE_EXISTS,
} from './store/version/mutations'

export default {
  name: 'App',
  components: {
    TheTopNavbar,
    ProgressBar,
  },
  computed: {
    ...mapState(NAMESPACE, {
      registration: (state) => state.registration,
      refreshing: (state) => state.refreshing,
      updateExists: (state) => state.updateExists,
    }),
  },
  mounted() {
    this.$Progress.finish()
  },
  created() {
    this.$Progress.start()
    this.$router.beforeEach((to, from, next) => {
      if (to.meta.progress !== undefined) {
        const meta = to.meta.progress
        this.$Progress.parseMeta(meta)
      }
      this.$Progress.start()
      next()
    })
    this.$router.afterEach((to, from) => {
      this.$Progress.finish()
    })

    document.addEventListener('swUpdated', this.updateAvailable, { once: true })

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (this.refreshing) return
      this.setRefreshing(true)
      window.location.reload()
    })
  },
  methods: {
    ...mapMutations({
      setRefreshing(commit, value) {
        return commit(NAMESPACE + '/' + SET_REFRESHING, value)
      },
      setRegistration(commit, registration) {
        return commit(NAMESPACE + '/' + SET_REGISTRATION, registration)
      },
      setUpdateExists(commit, value) {
        return commit(NAMESPACE + '/' + SET_UPDATE_EXISTS, value)
      },
    }),
    updateAvailable(event) {
      this.setRegistration(event.detail)
      this.setUpdateExists(true)
    },
  },
}
</script>

<style lang="scss">
@import 'node_modules/bootstrap/scss/bootstrap';
@import 'node_modules/bootstrap-vue/src/index.scss';
@import '@/scss/base';

.custom-select {
  -webkit-appearance: none;
  -moz-appearance: none;
}
</style>
