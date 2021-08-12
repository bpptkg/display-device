<template>
  <component
    :is="itemTag"
    v-bind="computedAttrs"
    :class="classNames"
    :to="to"
    :active-class="itemTag === 'router-link' ? 'menu-item--active' : null"
  >
    <slot></slot>
  </component>
</template>

<script>
const RoundOptions = Object.freeze({
  LEFT: 'left',
  RIGHT: 'right',
})

export default {
  name: 'SidepanelMenuItem',
  props: {
    active: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    menuItemClass: {
      type: [Array, Object, String],
      default: null,
    },
    round: {
      type: String,
      default: null,
    },
    tag: {
      type: String,
      default: 'a',
    },
    to: {
      type: [String, Object],
      default: null,
    },
    href: {
      type: String,
      default: null,
    },
    rel: {
      type: String,
      default: null,
    },
    referrerpolicy: {
      type: String,
      default: null,
    },
  },
  computed: {
    itemTag() {
      return this.to ? 'router-link' : this.tag
    },
    classNames() {
      return [
        'menu-item',
        {
          'menu-item--active': this.active,
          'menu-item--round-left': this.round === RoundOptions.LEFT,
          'menu-item--round-right': this.round === RoundOptions.RIGHT,
          'menu-item--disabled': this.disabled,
        },
        this.menuItemClass,
      ]
    },
    computedAttrs() {
      return {
        role:
          this.tag === 'a' ? 'link' : this.tag === 'button' ? 'button' : null,
        tabindex: 0,
        href: this.href,
        rel: this.rel,
        referrerpolicy: this.referrerpolicy,
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.menu-item {
  background-color: #fff;
  border: none;
  color: #3c4043;
  cursor: pointer;
  display: block;
  font-size: 0.875rem;
  padding: 0.55rem 0.85rem;
  text-align: left;
  text-decoration: none;
  user-select: none;
  width: 100%;

  &--active {
    background-color: rgba(26, 115, 232, 0.102);
    color: #1a73e8;
    pointer-events: none;
  }

  &:hover {
    background-color: #f1f3f4;
  }

  &:focus {
    outline: none;
    background-color: #f1f3f4;
  }

  &--round-left {
    border-radius: 24px 0 0 24px;
    -webkit-border-radius: 24px 0 0 24px;
  }

  &--round-right {
    border-radius: 0 24px 24px 0;
    -webkit-border-radius: 0 24px 24px;
  }

  &--disabled {
    opacity: 0.4;
    pointer-events: none;
  }
}
</style>
