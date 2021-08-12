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
      d="M14 2H6C4.90002 2 4 2.89999 4 4V20C4 21.1 4.89001 22 5.98999 22H18C19.1 22 20 21.1 20 20V8L14 2ZM16 12H8V14H16V12ZM16 16H8V18H16V16ZM6 20H18V9H13V4H6V20Z"
    />
  </svg>
</template>

<script>
import iconMixin from '../mixin'

export default {
  name: 'DescriptionIcon',
  mixins: [iconMixin],
}
</script>
