<template>
  <component
    :is="tag"
    class="sidepanel"
    :class="classNames"
    :style="computedAttrs"
  >
    <slot></slot>
  </component>
</template>

<script>
export default {
  name: 'Sidepanel',
  props: {
    ariaLabel: {
      type: String,
      default: null,
    },
    ariaLabelledby: {
      type: String,
      default: null,
    },
    maxWidth: {
      type: String,
      default: null,
    },
    minWidth: {
      type: String,
      default: null,
    },
    noBorder: {
      type: Boolean,
      default: false,
    },
    right: {
      type: Boolean,
      default: false,
    },
    sidepanelClass: {
      type: [String, Array, Object],
      default: null,
    },
    tag: {
      type: String,
      default: 'div',
    },
    width: {
      type: String,
      default: null,
    },
    zIndex: {
      type: [String, Number],
      default: 1000,
    },
  },
  computed: {
    computedAttrs() {
      return {
        width: this.width,
        maxWidth: this.maxWidth,
        minWidth: this.minWidth,
        zIndex: this.zIndex,
        role: 'dialog',
        tabindex: '-1',
        ariaLabel: this.ariaLabel || null,
        ariaLabelledby: this.ariaLabelledby || null,
      }
    },
    classNames() {
      return [
        'sidepanel',
        {
          'sidepanel--left': !this.right,
          'sidepanel--right': this.right,
          'sidepanel--no-border': this.noBorder,
        },
        this.sidepanelClass,
      ]
    },
  },
}
</script>

<style lang="scss" scoped>
.sidepanel {
  position: fixed;
  background-color: #fff;
  top: 0;
  bottom: 0;

  &--left {
    left: 0 !important;
    border-right: 1px solid rgba(0, 0, 0, 0.1);
  }

  &--right {
    right: 0 !important;
    border-left: 1px solid rgba(0, 0, 0, 0.1);
  }

  &--no-border {
    border: none !important;
  }
}
</style>
