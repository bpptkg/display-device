<template>
  <BContainer>
    <div class="view">
      <div class="mb-2">
        <BNav tabs>
          <BNavItem to="/magnetic/babadan" active-class="active">
            Babadan
          </BNavItem>
          <BNavItem to="/magnetic/imogiri" active-class="active">
            Imogiri
          </BNavItem>
        </BNav>
      </div>
      <keep-alive>
        <router-view :key="$route.path"></router-view>
      </keep-alive>
    </div>
  </BContainer>
</template>

<script>
import { BContainer, BNav, BNavItem } from 'bootstrap-vue'

export default {
  name: 'MagneticView',
  components: {
    BContainer,
    BNav,
    BNavItem,
  },
}
</script>

<style lang="scss" scoped>
.view {
  margin-top: 60px;
}
</style>
