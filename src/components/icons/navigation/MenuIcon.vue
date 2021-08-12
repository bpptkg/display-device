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
      d="M3 8V6H21V8H3ZM3 13H21V11H3V13ZM3 18H21V16H3V18Z"
    />
  </svg>
</template>

<script>
import iconMixin from '../mixin'

export default {
  name: 'MenuIcon',
  mixins: [iconMixin],
}
</script>
