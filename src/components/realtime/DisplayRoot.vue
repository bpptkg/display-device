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
  margin-top: 60px;
  margin-bottom: 50px;
}
</style>
