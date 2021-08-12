<template>
  <BTab title-link-class="obs-title-link">
    <template #title>
      <span>{{ title }}</span>
      <BBadge :variant="active ? 'primary' : 'secondary'" pill>
        {{ length }}
      </BBadge>
    </template>
    <slot></slot>
  </BTab>
</template>

<script>
import { BTab, BBadge } from 'bootstrap-vue'

export default {
  name: 'EventTab',
  components: {
    BTab,
    BBadge,
  },
  props: {
    title: {
      type: String,
      default: null,
    },
    active: {
      type: Boolean,
      default: false,
    },
    length: {
      type: Number,
      default: null,
    },
  },
}
</script>

<style lang="scss">
.obs-title-link {
  background-color: #fff;
  border-radius: 25px;
  border: 1px solid #dadce0;
  box-sizing: border-box;
  color: #202124;
  margin-left: 3px;
  margin-right: 3px;

  &:hover {
    background-color: #f1f3f4;
  }
}
</style>
