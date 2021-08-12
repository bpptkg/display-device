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
      d="M23 21.5L12 2.5L1 21.5H23ZM11 18.5V16.5H13V18.5H11ZM11 14.5H13V10.5H11V14.5Z"
    />
  </svg>
</template>

<script>
import iconMixin from '../mixin'

export default {
  name: 'WarningIcon',
  mixins: [iconMixin],
}
</script>
