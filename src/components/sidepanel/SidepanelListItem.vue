<template>
  <component :is="tag" :class="classNames">
    <slot></slot>
  </component>
</template>

<script>
export default {
  name: 'SidepanelListItem',
  props: {
    tag: {
      type: String,
      default: 'div',
    },
    listItemClass: {
      type: [Array, Object, String],
      default: null,
    },
    bordered: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    classNames() {
      return [
        'list-item',
        {
          'list-item--bordered': this.bordered,
        },
        this.listItemClass,
      ]
    },
  },
}
</script>

<style lang="scss" scoped>
.list-item {
  display: block;
  background-color: #fff;
  padding: 0.5rem 0.65rem;
  font-size: 12px;

  &--bordered {
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
}
</style>
