<template>
  <svg
    :width="iconSize"
    :height="iconSize"
    :viewBox="viewBox"
    :fill="color"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z"
    />
  </svg>
</template>

<script>
import iconMixin from '../mixin'

export default {
  name: 'ArrowForwardIcon',
  mixins: [iconMixin],
}
</script>
