<template>
  <svg
    :width="iconSize"
    :height="iconSize"
    :viewBox="viewBox"
    :fill="color"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z"
    />
  </svg>
</template>

<script>
import iconMixin from '../mixin'

export default {
  name: 'ArrowBackIcon',
  mixins: [iconMixin],
}
</script>
