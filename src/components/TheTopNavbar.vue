<template>
  <DNavbar class="navbar" fixed="top">
    <div
      v-if="isSearchOpen"
      class="w-100 d-flex justify-content-center align-items-center"
    >
      <DButtonIcon
        v-b-tooltip.hover
        :icon="ArrowBackIcon"
        icon-color="#5f6368"
        circle
        no-border
        no-shadow
        @click.native="hideSearchOpen"
        title="Go back"
      />
      <SearchBox class="ml-2" ref="searchBox" />
    </div>
    <div v-else class="w-100 d-flex justify-content-between align-items-center">
      <div class="d-flex align-items-center">
        <div v-clickaway="hideMenu">
          <a
            id="guide-button"
            class="menu-link"
            @click="toggleMenu"
            v-b-tooltip.hover
            title="Menu"
          >
            <MenuIcon color="#5f6368" />
          </a>
          <TheSidebarMenu />
        </div>
        <div class="logo-container">
          <BLink to="/" v-b-tooltip.hover title="Display Device Home">
            <LogoIcon />
          </BLink>
        </div>
      </div>
      <div class="d-flex align-items-center">
        <SearchBar class="mx-2" />
        <TheHelpMenu class="mr-2" />
        <TheAppLauncher class="mr-2" />
        <TheAvatar />
      </div>
    </div>
  </DNavbar>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import { BLink, VBTooltip } from 'bootstrap-vue'
import { directive as clickaway } from 'vue-clickaway'
import DNavbar from './base/navbar/DNavbar'
import { LogoIcon, MenuIcon } from './icons'
import TheAppLauncher from './TheAppLauncher'
import TheSidebarMenu from './TheSidebarMenu'
import TheHelpMenu from './TheHelpMenu'
import TheAvatar from './TheAvartar'
import SearchBar from './SearchBar'
import { HIDE_MENU } from '@/store/sidebar-menu/actions'

import { NAMESPACE } from '@/store/search'
import { SET_SEARCH_OPEN } from '@/store/search/mutations'

import SearchBox from './SearchBox'
import DButtonIcon from './base/button-icon/DButtonIcon'
import { ArrowBackIcon } from './icons/navigation'

export default {
  name: 'TheTopNavbar',
  components: {
    BLink,
    DNavbar,
    LogoIcon,
    MenuIcon,
    TheAppLauncher,
    TheSidebarMenu,
    TheHelpMenu,
    TheAvatar,
    SearchBar,
    SearchBox,
    DButtonIcon,
  },
  directives: {
    clickaway,
    'b-tooltip': VBTooltip,
  },
  data() {
    return {
      ArrowBackIcon,
    }
  },
  computed: {
    ...mapState(NAMESPACE, {
      isSearchOpen: (state) => state.isSearchOpen,
    }),
  },
  watch: {
    isSearchOpen(value) {
      // Set search box to focus whenever search bar is requested.
      if (value) {
        this.$nextTick(() => {
          this.$refs.searchBox.focus()
        })
      }
    },
  },
  methods: {
    ...mapActions(['toggleMenu']),
    hideMenu(event) {
      if (!this.$el.contains(event.target) && this.$el !== event.target) {
        this.$store.dispatch(HIDE_MENU)
      }
    },
    ...mapMutations({
      setSearchOpen(commit, value) {
        return commit(NAMESPACE + '/' + SET_SEARCH_OPEN, value)
      },
    }),
    hideSearchOpen() {
      this.setSearchOpen(false)
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
}

.menu-link {
  cursor: pointer;
}

.logo-container {
  margin-left: 16px;
}
</style>
