<template>
  <div>
    <ProgressBar />
    <TheTopNavbar />
    <router-view></router-view>
  </div>
</template>

<script>
import ProgressBar from './components/progressbar/ProgressBar'
import TheTopNavbar from './components/TheTopNavbar'

export default {
  name: 'App',
  components: {
    TheTopNavbar,
    ProgressBar,
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
