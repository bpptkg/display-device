<template>
  <div class="view">
    <Sidepanel class="main-nav p-0">
      <SidepanelScrollContainer>
        <SidepanelMenuHeader small bold> Thermal Axis </SidepanelMenuHeader>
        <div class="ml-2">
          <SidepanelMenuItem key="1" round="left" to="/thermal-axis/kaliurang">
            Kaliurang
          </SidepanelMenuItem>
          <SidepanelMenuItem key="2" round="left" to="/thermal-axis/jurangjero">
            Jurang Jero
          </SidepanelMenuItem>
          <SidepanelMenuItem key="3" round="left" to="/thermal-axis/deles">
            Deles
          </SidepanelMenuItem>
          <SidepanelMenuItem key="4" round="left" to="/thermal-axis/babadan">
            Babadan
          </SidepanelMenuItem>
        </div>
      </SidepanelScrollContainer>
    </Sidepanel>

    <BNav tabs class="tab-nav">
      <BNavItem to="/thermal-axis/kaliurang" active-class="active">
        Kaliurang
      </BNavItem>
      <BNavItem to="/thermal-axis/jurangjero" active-class="active">
        Jurangjero
      </BNavItem>
      <BNavItem to="/thermal-axis/deles" active-class="active">
        Deles
      </BNavItem>
      <BNavItem to="/thermal-axis/babadan" active-class="active">
        Babadan
      </BNavItem>
    </BNav>

    <div class="content">
      <router-view :key="$route.path"></router-view>
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
