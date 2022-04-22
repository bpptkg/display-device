<template>
  <a v-if="updateExists" class="menu-link" @click="refreshApp">
    <div>New version available</div>
    <div>Click to update</div>
  </a>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { NAMESPACE } from '@/store/version'
import { SET_UPDATE_EXISTS } from '@/store/version/mutations'

export default {
  name: 'NewVersion',
  computed: {
    ...mapState(NAMESPACE, {
      updateExists: (state) => state.updateExists,
    }),
  },
  methods: {
    ...mapMutations({
      setUpdateExists(commit, value) {
        return commit(NAMESPACE + '/' + SET_UPDATE_EXISTS, value)
      },
    }),
    refreshApp() {
      this.setUpdateExists(false)
      if (!this.registration || !this.registration.waiting) return
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' })
    },
  },
}
</script>

<style lang="scss" scoped>
.menu-link {
  color: #3c4043;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  outline: none;
  height: 48px;
  padding: 5px;
  background-color: #f8cb00;
  text-decoration: none;
  text-overflow: ellipsis;
  vertical-align: middle;
  white-space: nowrap;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
