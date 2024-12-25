<template>
  <div class="view">
    <Sidepanel class="main-nav p-0">
      <SidepanelScrollContainer>
        <SidepanelMenuHeader small bold> GBInSAR </SidepanelMenuHeader>
        <div class="ml-2">
          <SidepanelMenuItem key="1" round="left" to="/gbinsar/babadanarea">
            Babadan Area
          </SidepanelMenuItem>
          <SidepanelMenuItem key="2" round="left" to="/gbinsar/babadanpoint">
            Babadan Point
          </SidepanelMenuItem>
          <SidepanelMenuItem key="3" round="left" to="/gbinsar/turgoarea">
            Turgo Area
          </SidepanelMenuItem>
        </div>
      </SidepanelScrollContainer>
    </Sidepanel>

    <BNav tabs class="tab-nav">
      <BNavItem to="/gbinsar/babadanarea" active-class="active">
        Babadan Area
      </BNavItem>
      <BNavItem to="/gbinsar/babadanpoint" active-class="active">
        Babadan Point
      </BNavItem>
      <BNavItem to="/gbinsar/turgoarea" active-class="active">
        Turgo Area
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
  name: 'GBINSARView',
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
