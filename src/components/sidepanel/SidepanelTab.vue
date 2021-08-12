<template>
  <BTab title-link-class="custom-title-link" v-bind="$attrs" v-on="$listeners">
    <template #title>
      <slot v-if="$slots.icon" name="icon"></slot>
      <SidepanelTabNav v-else :icon="icon" :active="$attrs.active" />
    </template>

    <slot v-if="$slots.header" name="header"></slot>
    <SidepanelHeader v-else :title="$attrs.title" />

    <slot v-if="'no-body' in $attrs"></slot>
    <SidepanelBody v-else>
      <slot></slot>
    </SidepanelBody>
  </BTab>
</template>

<script>
import { BTab } from 'bootstrap-vue'
import SidepanelHeader from './SidepanelTabHeader'
import SidepanelBody from './SidepanelTabBody'
import SidepanelTabNav from './SidepanelTabNav'

export default {
  name: 'SidepanelTab',
  components: {
    BTab,
    SidepanelTabNav,
    SidepanelHeader,
    SidepanelBody,
  },
  props: {
    icon: {
      type: Object,
      default: null,
    },
    noHeader: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss">
.custom-title-link {
  padding: 0;
  border: none;
  margin: 2px 0;
  text-align: center;

  &.active {
    border: none;
  }

  &:hover {
    border: none;
  }
}
</style>
