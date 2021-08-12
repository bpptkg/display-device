<template>
  <component :is="tag" class="note">
    <slot></slot>
  </component>
</template>

<script>
export default {
  name: 'DNote',
  props: {
    tag: {
      type: String,
      default: 'div',
    },
  },
}
</script>

<style lang="scss" scoped>
.note {
  min-height: 17px;
  margin: 4px 0 2px;
  font-size: 12px;
  color: #586069;
}
</style>
