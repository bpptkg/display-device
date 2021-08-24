<template>
  <DNavbar class="navbar" fixed="top">
    <div v-clickaway="hideMenu">
      <a id="guide-button" class="menu-link" @click="toggleMenu">
        <MenuIcon color="#5f6368" />
      </a>
      <TheSidebarMenu />
    </div>
    <div class="logo-container">
      <BLink to="/">
        <LogoIcon />
      </BLink>
    </div>
    <div class="w-100 d-flex justify-content-end align-items-center">
      <TheAppLauncher />
    </div>
  </DNavbar>
</template>

<script>
import { mapActions } from 'vuex'
import { BLink } from 'bootstrap-vue'
import { directive as clickaway } from 'vue-clickaway'
import DNavbar from './base/navbar/DNavbar'
import { LogoIcon, MenuIcon } from './icons'
import TheAppLauncher from './TheAppLauncher'
import TheSidebarMenu from './TheSidebarMenu'
import { HIDE_MENU } from '../store/sidebar-menu/actions'

export default {
  name: 'TheTopNavbar',
  components: {
    BLink,
    DNavbar,
    LogoIcon,
    MenuIcon,
    TheAppLauncher,
    TheSidebarMenu,
  },
  directives: {
    clickaway,
  },
  methods: {
    ...mapActions(['toggleMenu']),
    hideMenu(event) {
      if (!this.$el.contains(event.target) && this.$el !== event.target) {
        this.$store.dispatch(HIDE_MENU)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.navbar {
  background-color: #ffffff;
  border-bottom: 1px solid #dadce0;
  height: 50px;
  padding-left: 24px;
  padding-right: 24px;
  z-index: 9999;
}

.menu-link {
  cursor: pointer;
}

.logo-container {
  margin-left: 16px;
}
</style>
