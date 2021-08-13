<template>
  <div class="menu-header">
    <a class="menu-link" @click="$emit('menu-click')">
      <MenuIcon class="menu-icon" />
    </a>
    <span class="menu-title">{{ title }}</span>
  </div>
</template>

<script>
import MenuIcon from '../icons/MenuIcon'

export default {
  name: 'SidebarMenuHeader',
  components: {
    MenuIcon,
  },
  props: {
    title: {
      type: String,
      default: 'Menu',
    },
  },
}
</script>

<style lang="scss" scoped>
.menu-header {
  border-bottom: 1px solid #dadce0;
  line-height: 48px;
  position: relative;
  width: 100%;
}

.menu-icon {
  height: 24px;
  vertical-align: middle;
  width: 24px;
  color: rgb(95, 99, 104);
}

.menu-link {
  cursor: pointer;
  margin-left: 24px;
}

.menu-title {
  font-size: 0.875rem;
  font-weight: 500;
  margin-left: 16px;
  vertical-align: middle;
}
</style>
