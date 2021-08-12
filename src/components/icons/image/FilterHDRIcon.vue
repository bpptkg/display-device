<template>
  <svg
    :width="iconSize"
    :height="iconSize"
    :viewBox="viewBox"
    :fill="color"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M9.78 11.63L14 6L23 18H1L6.53 10.63L10.54 16H19L14 9.33L11.03 13.3L9.78 11.63ZM6.52 13.97L5 16H8.04L6.52 13.97Z"
    />
  </svg>
</template>

<script>
import iconMixin from '../mixin'

export default {
  name: 'FilterHDRIcon',
  mixins: [iconMixin],
}
</script>
