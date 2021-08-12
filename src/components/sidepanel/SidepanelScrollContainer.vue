<template>
  <component :is="tag" class="scroll-container">
    <slot></slot>
  </component>
</template>

<script>
export default {
  name: 'SidepanelScrollContainer',
  props: {
    tag: {
      type: String,
      default: 'div',
    },
  },
}
</script>

<style lang="scss" scoped>
.scroll-container {
  height: 100%;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: 0.75rem;
}
</style>
