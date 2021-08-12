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
      d="M7.25 17H5.25V4H7.25V17ZM16 5H14.5L9.75 16H11.85L12.75 13.8H17.75L18.65 16H20.75L16 5ZM13.38 12L15.25 6.98L17.12 12H13.38Z"
    />
  </svg>
</template>

<script>
import iconMixin from '../mixin'

export default {
  name: 'AnnotationIcon',
  mixins: [iconMixin],
}
</script>
