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
      d="M15.17 9L12 5.82999L8.83008 9L7.41003 7.59L12 3L16.5801 7.59L15.17 9ZM8.83008 15L12 18.17L15.17 15L16.5901 16.41L12 21L7.42004 16.41L8.83008 15Z"
    />
  </svg>
</template>

<script>
import iconMixin from '../mixin'

export default {
  name: 'UnfoldMoreIcon',
  mixins: [iconMixin],
}
</script>
