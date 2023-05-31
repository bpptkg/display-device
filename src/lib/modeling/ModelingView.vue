<template>
  <div class="mx-1" style="margin-top: 60px">
    <BNav tabs class="mb-2">
      <BNavItem exact-active-class="active" to="/modeling/tilt">
        Tiltmeter
      </BNavItem>
    </BNav>
    <keep-alive>
      <router-view :key="$route.path"></router-view>
    </keep-alive>
  </div>
</template>

<script>
import { BNav, BNavItem } from 'bootstrap-vue'

export default {
  name: 'ModelingView',
  components: {
    BNavItem,
    BNav,
  },
}
</script>
