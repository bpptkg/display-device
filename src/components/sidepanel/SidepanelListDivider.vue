<template>
  <component :is="tag" v-bind="computedAttrs" class="list-divider" />
</template>

<script>
export default {
  name: 'SidepanelListDivider',
  props: {
    tag: {
      type: String,
      default: 'span',
    },
  },
  computed: {
    computedAttrs() {
      return {
        tabindex: -1,
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.list-divider {
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
  border: 0;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  box-sizing: content-box;
  overflow: visible;
  display: block;
  width: 100%;
}
</style>
