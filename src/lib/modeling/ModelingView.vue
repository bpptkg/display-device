<template>
  <div class="mx-2" style="margin-top: 60px">
    <b-nav tabs class="mb-2">
      <b-nav-item exact-active-class="active" to="/modeling/tilt"
        >Tiltmeter</b-nav-item
      >
      <!-- <b-nav-item exact-active-class="active" to="/modeling/gps"
        >GPS</b-nav-item
      > -->
    </b-nav>
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
