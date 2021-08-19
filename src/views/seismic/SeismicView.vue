<template>
  <div class="view">
    <Sidepanel class="main-nav p-0">
      <SidepanelScrollContainer>
        <SidepanelMenuHeader small bold> SEISMICS </SidepanelMenuHeader>
        <div class="ml-2">
          <SidepanelMenuItem round="left" to="/seismic/seismicity">
            Seismicity
          </SidepanelMenuItem>
          <SidepanelMenuItem round="left" to="/seismic/energy">
            Seismic Energy
          </SidepanelMenuItem>
          <SidepanelMenuItem round="left" to="/seismic/bulletin">
            Seismic Bulletin
          </SidepanelMenuItem>
          <SidepanelMenuItem round="left" to="/seismic/hypocenter">
            Hypocenter
          </SidepanelMenuItem>
          <SidepanelMenuItem round="left" to="/seismic/cluster">
            Cluster
          </SidepanelMenuItem>
          <SidepanelMenuItem round="left" to="/seismic/rsam">
            RSAM
          </SidepanelMenuItem>
          <SidepanelMenuItem round="left" to="/seismic/equivalent-energy">
            RF &amp; AP Energy
          </SidepanelMenuItem>
        </div>
      </SidepanelScrollContainer>
    </Sidepanel>
    <div class="main-view">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import {
  Sidepanel,
  SidepanelMenuHeader,
  SidepanelMenuItem,
  SidepanelScrollContainer,
} from '@/components/sidepanel'

export default {
  name: 'SeismicView',
  components: {
    Sidepanel,
    SidepanelMenuHeader,
    SidepanelMenuItem,
    SidepanelScrollContainer,
  },
}
</script>

<style lang="scss" scoped>
@import '@/scss/layout-monkey';

.main-view {
  margin-top: 60px;
}

.nav-wrapper {
  flex-wrap: nowrap;
  white-space: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
