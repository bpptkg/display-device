<template>
  <a v-if="updateExists" class="menu-link" @click="refreshApp">
    <div>New version available</div>
    <div>Click to update</div>
  </a>
</template>

<script>
import update from './mixins/update'
export default {
  name: 'NewVersion',
  mixins: [update],
}
</script>

<style lang="scss" scoped>
.menu-link {
  color: #3c4043;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  outline: none;
  height: 48px;
  padding: 5px;
  background-color: #f8cb00;
  text-decoration: none;
  text-overflow: ellipsis;
  vertical-align: middle;
  white-space: nowrap;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
