<template>
  <div class="body">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'SidepanelTabBody',
}
</script>

<style lang="scss" scoped>
.body {
  font-size: 12px;
  padding: 0.5rem 0.65rem;
}
</style>
