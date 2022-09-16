<template>
  <div>
    <div class="search-bar-mobile">
      <DButtonIcon
        v-b-tooltip.hover
        :icon="SearchIcon"
        icon-color="#5f6368"
        circle
        no-border
        no-shadow
        @click.native="showSearchOpen"
        title="Search"
      />
    </div>
    <div class="search-bar-desktop">
      <SearchBox />
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { VBTooltip } from 'bootstrap-vue'
import SearchIcon from './icons/action/SearchIcon'
import DButtonIcon from './base/button-icon/DButtonIcon'
import SearchBox from './SearchBox'

import { NAMESPACE } from '@/store/search'
import { SET_SEARCH_OPEN } from '@/store/search/mutations'

export default {
  name: 'SearchBar',
  components: {
    DButtonIcon,
    SearchBox,
  },
  directives: {
    'b-tooltip': VBTooltip,
  },
  data() {
    return {
      SearchIcon,
    }
  },
  computed: {
    ...mapState(NAMESPACE, {
      isSearchOpen: (state) => state.isSearchOpen,
    }),
  },
  methods: {
    ...mapMutations({
      setSearchOpen(commit, value) {
        return commit(NAMESPACE + '/' + SET_SEARCH_OPEN, value)
      },
    }),
    showSearchOpen() {
      this.setSearchOpen(true)
    },
  },
}
</script>

<style lang="scss" scoped>
@media (max-width: 991.98px) {
  .search-bar-mobile {
    display: block;
  }
  .search-bar-desktop {
    display: none;
  }
}

@media (min-width: 992px) {
  .search-bar-desktop {
    display: block;
  }
  .search-bar-mobile {
    display: none;
  }
}
</style>
