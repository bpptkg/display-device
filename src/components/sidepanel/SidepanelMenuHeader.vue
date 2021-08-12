<template>
  <component :is="tag" v-bind="computedAttrs" :class="classNames">
    <slot></slot>
  </component>
</template>

<script>
export default {
  name: 'SidepanelMenuHeader',
  props: {
    menuHeaderClass: {
      type: [Array, Object, String],
      default: null,
    },
    tag: {
      type: String,
      default: 'div',
    },
    small: {
      type: Boolean,
      default: false,
    },
    bold: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    classNames() {
      return [
        'menu-header',
        {
          'menu-header--small': this.small,
          'menu-header--bold': this.bold,
        },
        this.menuHeaderClass,
      ]
    },
    computedAttrs() {
      return {
        tabindex: -1,
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.menu-header {
  color: #3c4043;
  display: inline-block;
  font-size: 0.95rem;
  outline: none;
  padding: 0.5rem 0.75rem;
  text-align: left;
  user-select: none;
  width: 100%;

  &--small {
    font-size: 0.8rem;
  }

  &--bold {
    font-weight: 500;
  }
}
</style>
