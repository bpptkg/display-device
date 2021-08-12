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
      d="M15.59 10.09L13 12.67V3H11V12.67L8.41 10.09L7 11.5L12 16.5L17 11.5L15.59 10.09ZM19 19V12H21V19C21 20.1 20.1 21 19 21H5C3.89999 21 3 20.1 3 19V12H5V19H19Z"
    />
  </svg>
</template>

<script>
import iconMixin from '../mixin'

export default {
  name: 'SaveAltIcon',
  mixins: [iconMixin],
}
</script>
