<template>
  <div class="view">
    <Sidepanel class="main-nav p-0">
      <SidepanelScrollContainer>
        <SidepanelMenuHeader small bold> Visual </SidepanelMenuHeader>
        <div class="ml-2">
          <SidepanelMenuItem
            key="kaliurang"
            round="left"
            to="/visual/kaliurang"
          >
            Pos Kaliurang
          </SidepanelMenuItem>
          <SidepanelMenuItem key="babadan" round="left" to="/visual/babadan">
            Pos Babadan
          </SidepanelMenuItem>
          <SidepanelMenuItem key="jrakah" round="left" to="/visual/jrakah">
            Pos Jrakah
          </SidepanelMenuItem>
          <SidepanelMenuItem key="selo" round="left" to="/visual/selo">
            Pos Selo
          </SidepanelMenuItem>
          <SidepanelMenuItem key="ngepos" round="left" to="/visual/ngepos">
            Pos Ngepos
          </SidepanelMenuItem>
        </div>
      </SidepanelScrollContainer>
    </Sidepanel>

    <BNav tabs class="tab-nav">
      <BNavItem to="/visual/kaliurang" active-class="active">
        Kaliurang
      </BNavItem>
      <BNavItem to="/visual/babadan" active-class="active"> Babadan </BNavItem>
      <BNavItem to="/visual/jrakah" active-class="active"> Jrakah </BNavItem>
      <BNavItem to="/visual/selo" active-class="active"> Selo </BNavItem>
      <BNavItem to="/visual/ngepos" active-class="active"> Ngepos </BNavItem>
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
  name: 'VisualView',
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
@import '@/scss/layout-fish';
</style>
