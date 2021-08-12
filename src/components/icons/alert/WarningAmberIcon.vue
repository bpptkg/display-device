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
      d="M1 21.5L12 2.5L23 21.5H1ZM19.53 19.5L12 6.48999L4.46997 19.5H19.53ZM11 16.5V18.5H13V16.5H11ZM11 10.5H13V14.5H11V10.5Z"
    />
  </svg>
</template>

<script>
import iconMixin from '../mixin'

export default {
  name: 'WarningAmberIcon',
  mixins: [iconMixin],
}
</script>
