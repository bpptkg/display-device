<template>
  <component :is="tag" class="list" :class="classNames" v-bind="computedAttrs">
    <slot></slot>
  </component>
</template>

<script>
export default {
  name: 'SidepanelList',
  props: {
    tag: {
      type: String,
      default: 'div',
    },
    listClass: {
      type: [Array, Object, String],
      default: null,
    },
    center: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    classNames() {
      return [
        'list',
        {
          'list--center': this.center,
        },
        this.listClass,
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
.list {
  margin: 0;
  border: 0;
  display: flex;
  flex-direction: column;
  outline: none;

  &--center {
    align-items: center !important;
  }
}
</style>
