<template>
  <BDropdown
    v-bind="$attrs"
    no-caret
    class="more-menu-button"
    size="sm"
    v-on="$listeners"
  >
    <template #button-content>
      <MoreHorizontalIcon v-if="horizontal" :color="iconColor" />
      <MoreVerticalIcon v-else :color="iconColor" />
    </template>
    <slot></slot>
  </BDropdown>
</template>

<script>
import { BDropdown } from 'bootstrap-vue'
import { MoreHorizontalIcon, MoreVerticalIcon } from '../icons/navigation'

export default {
  name: 'MoreMenu',
  components: {
    BDropdown,
    MoreHorizontalIcon,
    MoreVerticalIcon,
  },
  props: {
    horizontal: {
      type: Boolean,
      default: false,
    },
    iconColor: {
      type: String,
      default: '#3c4043',
    },
  },
}
</script>

<style lang="scss">
.more-menu-button {
  & > button {
    color: #24292e;
    background-color: transparent;
    border: none;
    padding: 0.25rem 0.25rem;

    &:hover {
      color: #24292e;
      background-color: #f3f4f6;
      border-color: rgba(27, 31, 35, 0.15);
    }
  }
  &.show {
    & > button {
      background-color: #f3f4f6 !important;
      border-color: none !important;
    }
    & .dropdown-toggle::after {
      color: #24292e !important;
    }
  }
}
</style>
