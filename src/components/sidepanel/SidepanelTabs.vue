<template>
  <Sidepanel :right="isRight" :sidepanel-class="sidepanelClass">
    <BTabs
      :end="isRight"
      active-tab-class="custom-active-tab"
      class="sidepanel-tabs"
      content-class="custom-content"
      :nav-wrapper-class="[
        'custom-nav-wrapper',
        {
          'custom-nav-wrapper--border-right': !isRight,
          'custom-nav-wrapper--border-left': isRight,
        },
      ]"
      no-fade
      no-nav-style
      vertical
      v-bind="$attrs"
      v-on="$listeners"
    >
      <slot></slot>
    </BTabs>
  </Sidepanel>
</template>

<script>
import { BTabs } from 'bootstrap-vue'
import Sidepanel from './Sidepanel'

const TabPositions = Object.freeze({
  LEFT: 'left',
  RIGHT: 'right',
})

export default {
  name: 'SidepanelTabs',
  components: {
    Sidepanel,
    BTabs,
  },
  props: {
    position: {
      type: String,
      default: TabPositions.RIGHT,
    },
    sidepanelClass: {
      type: [String, Array, Object],
      default: null,
    },
  },
  computed: {
    isRight() {
      return this.position === TabPositions.RIGHT
    },
  },
}
</script>

<style lang="scss">
$border: 1px solid #dee2e6;

.sidepanel-tabs {
  width: 100%;
  height: 100%;
  margin: 0;
}

.custom-nav-wrapper {
  align-items: center;
  padding: 5px 5px;
  width: 50px;

  & > ul {
    border-bottom: none;
  }

  &--border-left {
    border-left: $border;
  }
  &--border-right {
    border-right: $border;
  }
}

.custom-content {
  padding: 0;
  width: 100%;
  height: 100%;
  overflow-y: auto;
}
</style>
