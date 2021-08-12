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
      d="M3 4H21C21.55 4 22 4.45001 22 5V19C22 19.55 21.55 20 21 20H3C2.44995 20 2 19.55 2 19V5C2 4.45001 2.44995 4 3 4ZM4 18H8V6H4V18ZM14 18H10V6H14V18ZM16 18H20V6H16V18Z"
    />
  </svg>
</template>

<script>
import iconMixin from './mixin'

export default {
  name: 'LayoutIcon',
  mixins: [iconMixin],
}
</script>
