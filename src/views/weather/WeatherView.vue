<template>
  <div class="view">
    <Sidepanel class="main-nav p-0">
      <SidepanelScrollContainer>
        <SidepanelMenuHeader small bold> WEATHER </SidepanelMenuHeader>
        <div class="ml-2">
          <SidepanelMenuItem round="left" to="/weather/pasarbubar">
            Pasarbubar
          </SidepanelMenuItem>
          <SidepanelMenuItem round="left" to="/weather/babadan">
            Babadan
          </SidepanelMenuItem>
        </div>
      </SidepanelScrollContainer>
    </Sidepanel>
    <BNav tabs class="tab-nav">
      <BNavItem to="/weather/pasarbubar" active-class="active">
        Pasarbubar
      </BNavItem>
      <BNavItem to="/weather/babadan" active-class="active"> Babadan </BNavItem>
    </BNav>
    <div class="content">
      <keep-alive>
        <router-view></router-view>
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
  name: 'WeatherView',
  components: {
    BNav,
    BNavItem,
    Sidepanel,
    SidepanelMenuHeader,
    SidepanelMenuItem,
    SidepanelScrollContainer,
  },
}
</script>

<style lang="scss" scoped>
@import '@/scss/layout-monkey';
</style>
