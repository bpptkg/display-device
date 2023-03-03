<template>
  <svg
    :width="iconSize"
    :height="iconSize"
    :viewBox="viewBox"
    :fill="color"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3.5 18.995H14.5C15.17 18.995 15.77 18.675 16.13 18.165L20.5 12.005L16.13 5.845C15.77 5.335 15.17 5.005 14.5 5.005H3.5L8.5 12.005L3.5 18.995Z"
    />
  </svg>
</template>

<script>
import iconMixin from './mixin'

export default {
  name: 'LayoutIcon',
  mixins: [iconMixin],
}
</script>
