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
          <SidepanelMenuItem round="left" to="/weather/rainfall-station">
            Rainfall Station
          </SidepanelMenuItem>
        </div>
      </SidepanelScrollContainer>
    </Sidepanel>
    <div class="content">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
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
  name: 'WeatherView',
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

@media (max-width: 991.98px) {
  .content {
    margin-top: 60px;
  }
}
</style>
