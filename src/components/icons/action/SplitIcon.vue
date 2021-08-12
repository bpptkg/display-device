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
      d="M21 4H3C2.45 4 2 4.45 2 5V19C2 19.55 2.45 20 3 20H21C21.55 20 22 19.55 22 19V5C22 4.45 21.55 4 21 4ZM11 18H4V6H11V18ZM13 18H20V6H13V18Z"
    />
  </svg>
</template>

<script>
import iconMixin from '../mixin'

export default {
  name: 'SplitIcon',
  mixins: [iconMixin],
}
</script>
