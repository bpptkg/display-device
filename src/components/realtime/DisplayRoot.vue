<template>
  <BContainer class="display">
    <slot></slot>
  </BContainer>
</template>

<script>
import { BContainer } from 'bootstrap-vue'
export default {
  name: 'DisplayRoot',
  components: {
    BContainer,
  },
}
</script>

<style lang="scss" scoped>
.display {
  margin-top: 50px;
  margin-bottom: 50px;
}
</style>
