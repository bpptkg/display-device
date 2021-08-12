<template>
  <component :is="tag" class="list-header" :class="classNames">
    <slot></slot>
  </component>
</template>

<script>
export default {
  name: 'SidepanelListHeader',
  props: {
    bold: {
      type: Boolean,
      default: false,
    },
    listHeaderClass: {
      type: [Array, Object, String],
      default: null,
    },
    tag: {
      type: String,
      default: 'div',
    },
  },
  computed: {
    classNames() {
      return ['list-header', this.listHeaderClass]
    },
  },
}
</script>

<style lang="scss" scoped>
.list-header {
  display: block;
  padding: 0.25rem 0.65rem;
  font-size: 12px;
  font-weight: 500;
}
</style>
