<template>
  <div class="view">
    <Sidepanel class="main-nav p-0">
      <SidepanelScrollContainer>
        <SidepanelMenuHeader small bold> GEOCHEMISTRY </SidepanelMenuHeader>
        <div class="ml-2">
          <SidepanelMenuItem round="left" to="/geochemistry/vogamos">
            Vogamos
          </SidepanelMenuItem>
          <SidepanelMenuItem round="left" to="/geochemistry/doas/babadan">
            DOAS
          </SidepanelMenuItem>
        </div>
      </SidepanelScrollContainer>
    </Sidepanel>
    <BNav tabs class="tab-nav">
      <BNavItem to="/geochemistry/vogamos" active-class="active">
        Vogamos
      </BNavItem>
      <BNavItem to="/geochemistry/doas/babadan" active-class="active">
        DOAS
      </BNavItem>
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
