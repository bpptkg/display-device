<template>
  <div class="dropdown">
    <BInputGroup>
      <div class="search-icon">
        <SearchIcon color="#5f6368" />
      </div>

      <BFormInput
        ref="searchBox"
        v-model="pattern"
        placeholder="Search"
        class="input-box"
        @keydown="handleKeyDown"
        tabindex="0"
      ></BFormInput>

      <div v-if="pattern.length" class="clear-icon">
        <DButtonIcon
          :icon="CloseIcon"
          icon-color="#5f6368"
          circle
          no-border
          no-shadow
          @click.native="clearSearch"
        />
      </div>
    </BInputGroup>

    <ul v-if="hasResult" class="dropdown-content">
      <li
        v-for="(result, index) in searchResult"
        :key="index"
        :class="{ 'item-focused': index === focusIndex }"
        role="presentation"
      >
        <a class="dropdown-item" @click="goTo(result.item.path)">
          {{ result.item.name }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { BFormInput, BInputGroup } from 'bootstrap-vue'
import fuse from '../search'

import { SearchIcon } from './icons/action'
import { CloseIcon } from './icons/navigation'
import DButtonIcon from './base/button-icon/DButtonIcon'

import { NAMESPACE } from '@/store/search'
import { SET_SEARCH_OPEN } from '@/store/search/mutations'

export default {
  name: 'SearchBox',
  components: {
    BFormInput,
    BInputGroup,
    DButtonIcon,
    SearchIcon,
  },
  data() {
    return {
      SearchIcon,
      CloseIcon,
      pattern: '',
      searchResult: null,
      focusIndex: 0,
    }
  },
  computed: {
    hasResult() {
      return Array.isArray(this.searchResult) && this.searchResult.length
    },
    ...mapState(NAMESPACE, {
      isSearchOpen: (state) => state.isSearchOpen,
    }),
  },
  watch: {
    pattern(value) {
      this.searchResult = fuse.search(value).slice(0, 10)
      this.focusIndex = 0
    },
  },
  methods: {
    handleKeyDown(event) {
      if (this.hasResult) {
        switch (event.keyCode) {
          case 38: // Arrow Up Key.
            if (this.focusIndex === null) {
              this.focusIndex = 0
            } else if (this.focusIndex > 0) {
              this.focusIndex--
            }
            break
          case 40: // Arrow Down Key.
            if (this.focusIndex === null) {
              this.focusIndex = 0
            } else if (this.focusIndex < this.searchResult.length - 1) {
              this.focusIndex++
            }
            break
          case 13: // Enter Key.
            this.goTo(this.searchResult[this.focusIndex].item.path)
        }
      }
    },
    ...mapMutations({
      setSearchOpen(commit, value) {
        return commit(NAMESPACE + '/' + SET_SEARCH_OPEN, value)
      },
    }),
    async goTo(path) {
      this.pattern = ''
      this.$refs.searchBox.blur()
      this.setSearchOpen(false)
      if (this.$route.path !== path) {
        this.$router.push(path)
      }
    },
    focus() {
      this.$refs.searchBox.focus()
    },
    blur() {
      this.$refs.searchBox.blur()
    },
    clearSearch() {
      this.pattern = ''
    },
  },
}
</script>

<style lang="scss" scoped>
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  position: absolute;
  right: 0;
  background-color: #fff;
  width: 100%;
  line-height: normal;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.3),
    0 2px 6px 2px rgba(60, 64, 67, 0.15);
  padding: 6px 0px;
  z-index: 1;
  max-height: 500px;
  overflow-x: hidden;
  overflow-y: auto;
}

.dropdown-item {
  cursor: pointer;
  display: block;
  color: #202124;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0.2px;
  line-height: 20px;
  outline: none;
  padding-right: 30px;
  padding-left: 30px;
  padding-top: 6px;
  padding-bottom: 6px;
}

.dropdown-divider {
  border-top: 1px solid rgba(0, 0, 0, 0.12);
  margin: 7px 0;
}

.item-focused {
  color: #16181b;
  text-decoration: none;
  background-color: #e9ecef;
}

.search-icon {
  position: absolute;
  z-index: 10;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
}

.clear-icon {
  position: absolute;
  z-index: 10;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  right: 0;
}

.input-box {
  padding-left: 32px;
  padding-right: 32px;
  border-radius: 8px !important;
  min-width: 250px;
}
</style>
