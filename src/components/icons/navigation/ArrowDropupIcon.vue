<template>
  <svg
    :width="iconSize"
    :height="iconSize"
    :viewBox="viewBox"
    :fill="color"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M7 14.5L12 9.5L17 14.5H7Z" />
  </svg>
</template>

<script>
import iconMixin from '../mixin'

export default {
  name: 'ArrowDropupIcon',
  mixins: [iconMixin],
}
</script>
