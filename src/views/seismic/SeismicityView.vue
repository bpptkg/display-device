<template>
  <div class="content">
    <BNav tabs class="mb-3">
      <BNavItem
        v-for="type in types"
        :key="type.value"
        :to="type.url"
        exact-active-class="active"
      >
        {{ type.label }}
      </BNavItem>
    </BNav>
    <router-view> </router-view>
  </div>
</template>

<script>
import { BNav, BNavItem } from 'bootstrap-vue'

export default {
  name: 'SeismicityView',
  components: {
    BNav,
    BNavItem,
  },
  data() {
    return {
      types: [
        { value: 'manual', label: 'Manual', url: '/seismic/seismicity/manual' },
        {
          value: 'cluster',
          label: 'Cluster',
          url: '/seismic/seismicity/cluster',
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
@import '@/scss/layout-monkey';

.nav-wrapper {
  flex-wrap: nowrap;
  white-space: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
