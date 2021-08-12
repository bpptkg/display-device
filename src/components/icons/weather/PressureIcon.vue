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
      d="M13 6.5H16L12 11L8 6.5H11V2H13V6.5ZM11 17.5H8L12 13L16 17.5H13V22H11V17.5Z"
    />
  </svg>
</template>

<script>
import iconMixin from '../mixin'

export default {
  name: 'PressureIcon',
  mixins: [iconMixin],
}
</script>
