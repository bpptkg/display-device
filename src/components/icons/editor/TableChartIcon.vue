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
      d="M19.5 3H4.5C3.39999 3 2.5 3.9 2.5 5V19C2.5 20.1 3.39999 21 4.5 21H19.5C20.6 21 21.5 20.1 21.5 19V5C21.5 3.9 20.6 3 19.5 3ZM19.5 5V8H4.5V5H19.5ZM9.5 19H14.5V10H9.5V19ZM4.5 10H7.5V19H4.5V10ZM16.5 10V19H19.5V10H16.5Z"
    />
  </svg>
</template>

<script>
import iconMixin from '../mixin'

export default {
  name: 'TableChartIcon',
  mixins: [iconMixin],
}
</script>
