<template>
  <div class="header">
    {{ title }}
  </div>
</template>

<script>
export default {
  name: 'SidepanelTabHeader',
  props: {
    title: {
      type: String,
      default: '',
    },
  },
}
</script>

<style lang="scss" scoped>
.header {
  font-size: 14px;
  color: #3c4043;
  width: 100%;
  display: block;
  padding: 0.5rem 0.65rem;
  border-bottom: 1px solid #dee2e6;
}
</style>
