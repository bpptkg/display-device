<template>
  <BButtonGroup v-bind="$attrs" v-on="$listeners">
    <slot></slot>
  </BButtonGroup>
</template>

<script>
import { BButtonGroup } from 'bootstrap-vue'
export default {
  name: 'DButtonGroup',
  components: {
    BButtonGroup,
  },
}
</script>
