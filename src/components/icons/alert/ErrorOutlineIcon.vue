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
      d="M11.99 2C6.46997 2 2 6.48001 2 12C2 17.52 6.46997 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48001 17.52 2 11.99 2ZM13 13V7H11V13H13ZM13 17V15H11V17H13ZM4 12C4 16.42 7.58002 20 12 20C16.42 20 20 16.42 20 12C20 7.57999 16.42 4 12 4C7.58002 4 4 7.57999 4 12Z"
    />
  </svg>
</template>

<script>
import iconMixin from '../mixin'

export default {
  name: 'ErrorOutlineIcon',
  mixins: [iconMixin],
}
</script>
