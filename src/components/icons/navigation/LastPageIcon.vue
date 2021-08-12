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
      d="M10.385 12L5.79504 7.41L7.20508 6L13.2051 12L7.20508 18L5.79504 16.59L10.385 12ZM18.2051 6H16.2051V18H18.2051V6Z"
    />
  </svg>
</template>

<script>
import iconMixin from '../mixin'

export default {
  name: 'LastPageIcon',
  mixins: [iconMixin],
}
</script>
