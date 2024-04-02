<template>
  <div class="view">
    <Sidepanel class="main-nav p-0">
      <SidepanelScrollContainer>
        <SidepanelMenuHeader small bold> Thermal Axis </SidepanelMenuHeader>
        <div class="ml-2">
          <SidepanelMenuItem key="1" round="left" to="/thermal-axis/kaliurang">
            Kaliurang
          </SidepanelMenuItem>
        </div>
      </SidepanelScrollContainer>
    </Sidepanel>

    <BNav tabs class="tab-nav">
      <BNavItem to="/thermal-axis/kaliurang" active-class="active">
        Kaliurang
      </BNavItem>
    </BNav>

    <div class="content">
      <keep-alive>
        <router-view :key="$route.path"></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import { BNav, BNavItem } from 'bootstrap-vue'
import {
  Sidepanel,
  SidepanelMenuHeader,
  SidepanelMenuItem,
  SidepanelScrollContainer,
} from '@/components/sidepanel'

export default {
  name: 'ThermalAxisView',
  components: {
    Sidepanel,
    SidepanelMenuHeader,
    SidepanelMenuItem,
    SidepanelScrollContainer,
    BNav,
    BNavItem,
  },
}
</script>

<style lang="scss" scoped>
@import '@/scss/layout-monkey';
</style>
