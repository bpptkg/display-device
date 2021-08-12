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
      d="M12 2C6.47998 2 2 6.48001 2 12C2 17.52 6.47998 22 12 22C17.52 22 22 17.52 22 12C22 6.48001 17.52 2 12 2ZM11 17V15H13V17H11ZM11 7V13H13V7H11Z"
    />
  </svg>
</template>

<script>
import iconMixin from '../mixin'

export default {
  name: 'ErrorIcon',
  mixins: [iconMixin],
}
</script>
