<template>
  <svg
    :width="iconSize"
    :height="iconSize"
    :viewBox="viewBox"
    :fill="color"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M9.5 17L14.5 12L9.5 7V17Z" />
  </svg>
</template>

<script>
import iconMixin from '../mixin'

export default {
  name: 'ArrowRightIcon',
  mixins: [iconMixin],
}
</script>
