<template>
  <div class="app-launcher">
    <DButtonIcon
      v-clickaway="hide"
      v-b-tooltip.hover
      :icon="AppsIcon"
      icon-color="#5f6368"
      circle
      no-border
      no-shadow
      :active="visible"
      @click.native="toggle"
      title="Cendana15 apps"
    />
    <div v-show="visible" class="wrapper">
      <div class="content-scroll">
        <ul v-if="visibleItems.length" class="content">
          <AppLauncherItem
            v-for="(item, index) in visibleItems"
            :key="index"
            :item="item"
          />
        </ul>
        <span v-else class="item-empty">No menu available</span>
        <div class="content-footer">
          <BLink href="/"> Go to Home </BLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { BLink, VBTooltip } from 'bootstrap-vue'
import { directive as clickaway } from 'vue-clickaway'
import DButtonIcon from '../base/button-icon/DButtonIcon'
import AppLauncherItem from './AppLaucherItem'
import { AppsIcon } from '../icons/navigation'

export default {
  name: 'AppLauncher',
  components: {
    AppLauncherItem,
    DButtonIcon,
    BLink,
  },
  directives: {
    clickaway,
    'b-tooltip': VBTooltip,
  },
  props: {
    items: {
      type: Array,
      default: function () {
        return []
      },
    },
  },
  data() {
    return {
      AppsIcon,
      popper: null,
      visible: false,
    }
  },
  computed: {
    visibleItems() {
      return this.items.filter((v) => v.visible || false)
    },
  },
  methods: {
    toggle() {
      this.visible = !this.visible
    },
    show() {
      this.visible = true
    },
    hide() {
      this.visible = false
    },
  },
}
</script>

<style lang="scss" scoped>
.app-launcher {
  position: relative;
}

.content {
  box-sizing: content-box;
  margin: 0;
  max-height: 400px;
  padding: 10px 0 0 14px;
  width: 300px;
}

.content-scroll {
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.3),
    0 2px 6px 2px rgba(60, 64, 67, 0.15);
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;
  top: 20px;
}

.content-footer {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  display: block;
  font-size: 14px;
  margin-top: 15px;
  padding: 15px 15px;
  text-align: center;
}

.wrapper {
  position: absolute;
  right: 0;
}

.item-empty {
  padding: 10px 10px 15px 10px;
  position: relative;
  top: 10px;
  white-space: nowrap;
}
</style>
