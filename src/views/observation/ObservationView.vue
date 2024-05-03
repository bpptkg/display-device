<template>
  <div class="view">
    <Sidepanel class="main-nav p-0">
      <SidepanelScrollContainer>
        <SidepanelMenuHeader small bold> RF & AP </SidepanelMenuHeader>
        <div class="ml-2">
          <SidepanelMenuItem
            key="1"
            round="left"
            to="/observation/rfap-distance"
          >
            RF &amp; AP Distance
          </SidepanelMenuItem>
          <SidepanelMenuItem
            key="2"
            round="left"
            to="/observation/rfap-direction"
          >
            RF &amp; AP Direction
          </SidepanelMenuItem>
          <SidepanelMenuItem key="3" round="left" to="/observation/rfap-type">
            RF &amp; AP Type
          </SidepanelMenuItem>
        </div>
      </SidepanelScrollContainer>
    </Sidepanel>

    <BNav tabs class="tab-nav">
      <BNavItem to="/observation/rfap-distance" active-class="active">
        Distance
      </BNavItem>
      <BNavItem to="/observation/rfap-direction" active-class="active">
        Direction
      </BNavItem>
      <BNavItem to="/observation/rfap-type" active-class="active">
        Type
      </BNavItem>
    </BNav>

    <keep-alive>
      <router-view :key="$route.path"></router-view>
    </keep-alive>
  </div>
</template>

<script>
import { BNavItem, BNav } from 'bootstrap-vue'
import {
  Sidepanel,
  SidepanelMenuHeader,
  SidepanelMenuItem,
  SidepanelScrollContainer,
} from '@/components/sidepanel'

export default {
  name: 'ObservationView',
  components: {
    BNavItem,
    BNav,
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
