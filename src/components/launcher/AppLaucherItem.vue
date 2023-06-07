<template>
  <li class="item" v-b-tooltip.hover :title="item.text">
    <a
      class="item-link"
      :href="item.href"
      aria-grabbed="false"
      draggable="false"
    >
      <div class="item-image-wrapper">
        <img class="item-image" :src="item.src" :alt="item.text" />
      </div>
      <span class="item-text">{{ item.text }}</span>
    </a>
  </li>
</template>

<script>
import { VBTooltip } from 'bootstrap-vue'

export default {
  name: 'AppLauncherItem',
  props: {
    item: {
      type: Object,
      default: function () {
        return {}
      },
    },
  },
  directives: {
    'b-tooltip': VBTooltip,
  },
}
</script>

<style lang="scss" scoped>
.item {
  display: inline-block;
  height: 84px;
  list-style-type: none;
  padding: 6px;
  position: relative;
  transition: transform 0.2s cubic-bezier(0.333, 0, 0, 1);
  vertical-align: top;
  width: 84px;
  margin: 5px 5px;
}

.item-link {
  border-radius: 8px;
  margin: 0;
  outline: none;
  position: absolute;
  text-align: center;
  text-decoration: none;
  width: 84px;

  &:hover {
    background-color: #f6fafe;
    border: none;
    border-radius: 8px;
    margin: 0;
    z-index: 1;
  }
}

.item-image-wrapper {
  padding: 5px 5px;
  text-align: center;
}

.item-image {
  height: 40px;
  width: 40px;
  border-radius: 5px;
}

.item-text {
  color: #6a6c6e;
  display: inline-block;
  font-size: 12px;
  line-height: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 84px;
}
</style>
