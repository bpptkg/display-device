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
      d="M15.17 4L16.5901 5.41L12 10L7.41003 5.41L8.83008 4L12 7.17001L15.17 4ZM8.83008 20L7.41003 18.59L12 14L16.5801 18.59L15.17 20L12 16.83L8.83008 20Z"
    />
  </svg>
</template>

<script>
import iconMixin from '../mixin'

export default {
  name: 'UnfoldLessIcon',
  mixins: [iconMixin],
}
</script>
