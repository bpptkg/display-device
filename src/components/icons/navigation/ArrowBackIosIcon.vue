<template>
  <svg
    :width="iconSize"
    :height="iconSize"
    :viewBox="viewBox"
    :fill="color"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17.835 3.87001L16.055 2.10001L6.16504 12L16.065 21.9L17.835 20.13L9.70504 12L17.835 3.87001Z"
    />
  </svg>
</template>

<script>
import iconMixin from '../mixin'

export default {
  name: 'ArrowBackIosIcon',
  mixins: [iconMixin],
}
</script>
