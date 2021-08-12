<template>
  <BButton v-bind="$attrs" v-on="$listeners">
    <slot></slot>
  </BButton>
</template>

<script>
import { BButton } from 'bootstrap-vue'
export default {
  name: 'DButton',
  components: {
    BButton,
  },
}
</script>
