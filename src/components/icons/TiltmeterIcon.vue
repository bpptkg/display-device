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
      d="M9 4C4.58002 4 1 7.58 1 12C1 16.42 4.58002 20 9 20C13.42 20 17 16.42 17 12C17 7.58 13.42 4 9 4ZM9 18C5.69 18 3 15.31 3 12C3 8.69 5.69 6 9 6C12.31 6 15 8.69 15 12C15 15.31 12.31 18 9 18ZM17 6.34999V4.25999C20.45 5.14999 23 8.26999 23 12C23 15.73 20.45 18.85 17 19.74V17.65C19.33 16.83 21 14.61 21 12C21 9.39 19.33 7.17 17 6.34999Z"
    />
  </svg>
</template>

<script>
import iconMixin from './mixin'

export default {
  name: 'TiltmeterIcon',
  mixins: [iconMixin],
}
</script>
