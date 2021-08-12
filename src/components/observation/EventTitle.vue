<template>
  <div class="title">
    <span v-if="!$slots.default">
      {{ title }}
    </span>
    <slot v-else></slot>
  </div>
</template>

<script>
export default {
  name: 'EventTitle',
  props: {
    title: {
      type: String,
      default: null,
    },
  },
}
</script>

<style lang="scss" scoped>
.title {
  color: #202124;
  display: inline-block;
  border: 1px solid #dadce0;
  border-radius: 25px;
  box-sizing: border-box;
  background: #fff;
  padding: 7px 13px;
}
</style>
