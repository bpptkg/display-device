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
      d="M10 20H14V4H10V20ZM4 20H8V12H4V20ZM16 20V9H20V20H16Z"
    />
  </svg>
</template>

<script>
import iconMixin from '../mixin'

export default {
  name: 'EqualizerIcon',
  mixins: [iconMixin],
}
</script>
