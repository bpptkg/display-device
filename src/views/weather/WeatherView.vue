<template>
  <div class="view">
    <Sidepanel class="main-nav p-0">
      <SidepanelScrollContainer>
        <SidepanelMenuHeader small bold> WEATHER </SidepanelMenuHeader>
        <div class="ml-2">
          <SidepanelMenuItem round="left" to="/weather/pasarbubar2">
            Pasarbubar (Vaisala)
          </SidepanelMenuItem>
          <SidepanelMenuItem round="left" to="/weather/pasarbubar">
            Pasarbubar
          </SidepanelMenuItem>
          <SidepanelMenuItem round="left" to="/weather/klatakan">
            Klatakan
          </SidepanelMenuItem>
          <SidepanelMenuItem round="left" to="/weather/labuhan">
            Labuhan
          </SidepanelMenuItem>
          <SidepanelMenuItem round="left" to="/weather/selo">
            Selo
          </SidepanelMenuItem>
          <SidepanelMenuItem round="left" to="/weather/babadan">
            Babadan
          </SidepanelMenuItem>
          <SidepanelMenuItem round="left" to="/weather/jurangjero">
            Jurang Jero
          </SidepanelMenuItem>
          <SidepanelMenuItem round="left" to="/weather/jrakah">
            Jrakah
          </SidepanelMenuItem>
          <SidepanelMenuItem round="left" to="/weather/kaliurang">
            Kaliurang
          </SidepanelMenuItem>
          <SidepanelMenuItem round="left" to="/weather/ngepos">
            Ngepos
          </SidepanelMenuItem>
          <SidepanelMenuItem round="left" to="/weather/rainfall-station">
            Rainfall Station
          </SidepanelMenuItem>
          <SidepanelMenuItem round="left" to="/weather/rainfall-daily">
            Rainfall Daily
          </SidepanelMenuItem>
          <SidepanelMenuItem round="left" to="/rainfall-catalog">
            Rainfall Catalog
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
