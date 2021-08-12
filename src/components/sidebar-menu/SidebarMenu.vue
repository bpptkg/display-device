<template>
  <div>
    <transition name="slide">
      <div v-if="!collapsed" class="sidebar-menu">
        <slot name="header"></slot>
        <SidebarMenuItem
          v-for="(item, index) in menu"
          :key="index"
          :item="item"
          :active-show="activeShow"
          :child-item="childItem"
        />
        <slot name="footer"></slot>
      </div>
    </transition>
  </div>
</template>

<script>
import SidebarMenuItem from './SidebarMenuItem.vue'

export default {
  name: 'SidebarMenu',
  components: {
    SidebarMenuItem,
  },
  provide() {
    return {
      emitActiveShow: this.onActiveShow,
      emitItemClick: this.onItemClick,
      emitChildItem: this.setChildItem,
    }
  },
  props: {
    menu: {
      type: Array,
      required: true,
    },
    collapsed: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      activeShow: null,
      childItem: null,
    }
  },
  methods: {
    onItemClick(event, item) {
      this.$emit('item-click', event, item)
    },
    onActiveShow(item) {
      this.activeShow = item
    },
    setChildItem(item) {
      this.childItem = item
    },
  },
}
</script>

<style lang="scss" scoped>
.sidebar-menu {
  -webkit-flex-direction: columns;
  background-color: #ffffff;
  box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.302),
    0 2px 6px 2px rgba(60, 64, 67, 0.149);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;
  left: 0;
  max-width: 290px;
  overflow: auto;
  position: fixed;
  top: 0;
  width: calc(100% - 56px);
  will-change: transform;
  z-index: 4508;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.24, 1, 0.32, 1);
  -webkit-transition: transform 0.3s cubic-bezier(0.24, 1, 0.32, 1);
}
.slide-enter,
.slide-leave-to {
  transform: translateX(-290px);
  -webkit-transform: translateX(-290px);
}
</style>
