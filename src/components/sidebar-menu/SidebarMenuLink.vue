<template>
  <component
    :is="tag"
    :to="tag === 'router-link' && href"
    v-bind="
      tag !== 'router-link' && { href: href && !disabled ? href : undefined }
    "
    :tabindex="disabled ? -1 : 0"
    class="menu-link"
    :class="{ 'menu-link--disabled': disabled }"
    role="link"
    :target="target"
    :rel="rel"
    :referrerpolicy="referrerpolicy"
    @keydown.enter="$parent.clickEvent($event)"
  >
    <slot></slot>
  </component>
</template>

<script>
export default {
  name: 'SidebarMenuLink',
  props: {
    tag: {
      type: String,
      default: 'a',
    },
    href: {
      type: [String, Object],
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    target: {
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
}
</script>

<style lang="scss" scoped>
.menu-link {
  color: #3c4043;
  cursor: pointer;
  display: inline-block;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 48px;
  outline: none;
  padding-left: 16px;
  padding: 0 24px;
  text-decoration: none;
  text-overflow: ellipsis;
  vertical-align: middle;
  white-space: nowrap;
  width: 100%;

  &:hover {
    background-color: rgba(26, 115, 232, 0.102);
  }

  &--disabled {
    opacity: 0.4;
    pointer-events: none;
  }
}
</style>
