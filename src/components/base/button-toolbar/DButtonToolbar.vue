<template>
  <BButtonToolbar v-bind="$attrs" v-on="$listeners">
    <slot></slot>
  </BButtonToolbar>
</template>

<script>
import { BButtonToolbar } from 'bootstrap-vue'
export default {
  name: 'DButtonToolbar',
  components: {
    BButtonToolbar,
  },
}
</script>
