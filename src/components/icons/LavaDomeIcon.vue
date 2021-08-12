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
      d="M2 20L12 4L22 20H2ZM18.39 18L12 7.77L5.60999 18H18.39Z"
    />
  </svg>
</template>

<script>
import iconMixin from './mixin'

export default {
  name: 'LavaDomeIcon',
  mixins: [iconMixin],
}
</script>
