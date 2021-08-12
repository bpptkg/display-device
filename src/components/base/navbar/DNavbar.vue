<template>
  <BNavbar v-bind="$attrs" v-on="$listeners">
    <slot></slot>
  </BNavbar>
</template>

<script>
import { BNavbar } from 'bootstrap-vue'
export default {
  name: 'DNavbar',
  components: {
    BNavbar,
  },
}
</script>
