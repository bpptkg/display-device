<template>
  <div class="dropdown">
    <DButtonIcon
      v-clickaway="hide"
      v-b-tooltip.hover
      :icon="HelpOutlineIcon"
      icon-color="#5f6368"
      circle
      no-border
      no-shadow
      :active="visible"
      @click.native="toggle"
      title="Help"
    />
    <div v-show="visible" class="dropdown-content">
      <router-link class="dropdown-item" to="/about">About</router-link>
      <div class="dropdown-divider"></div>
      <BLink
        class="dropdown-item"
        href="https://github.com/bpptkg/display-device"
        target="_blank"
      >
        GitHub
      </BLink>
      <BLink
        class="dropdown-item"
        href="https://bma.cendana15.com/docs/"
        target="_blank"
      >
        API Documentation
      </BLink>
      <BLink
        class="dropdown-item"
        href="https://github.com/bpptkg/display-device/issues"
        target="_blank"
      >
        Submit an issue
      </BLink>
    </div>
  </div>
</template>

<script>
import { directive as clickaway } from 'vue-clickaway'
import { BLink, VBTooltip } from 'bootstrap-vue'
import DButtonIcon from './base/button-icon/DButtonIcon'
import { HelpOutlineIcon } from './icons/action'

export default {
  name: 'TheHelpMenu',
  components: {
    DButtonIcon,
    BLink,
  },
  directives: {
    clickaway,
    'b-tooltip': VBTooltip,
  },
  data() {
    return {
      HelpOutlineIcon,
      visible: false,
    }
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
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  position: absolute;
  right: 0;
  background-color: #fff;
  min-width: 112px;
  line-height: normal;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.3),
    0 2px 6px 2px rgba(60, 64, 67, 0.15);
  padding: 6px 0px;
  z-index: 1;
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
</style>
