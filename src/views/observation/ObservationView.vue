<template>
  <div class="view">
    <Sidepanel class="main-nav p-0">
      <SidepanelScrollContainer>
        <SidepanelMenuHeader small bold> Observation </SidepanelMenuHeader>
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
        </div>
      </SidepanelScrollContainer>
    </Sidepanel>

    <keep-alive>
      <router-view :key="$route.path"></router-view>
    </keep-alive>
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
  name: 'ObservationView',
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
</style>
