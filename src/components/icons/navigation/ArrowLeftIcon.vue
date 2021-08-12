<template>
  <svg
    :width="iconSize"
    :height="iconSize"
    :viewBox="viewBox"
    :fill="color"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M14.5 7L9.5 12L14.5 17V7Z" />
  </svg>
</template>

<script>
import iconMixin from '../mixin'

export default {
  name: 'ArrowLeftIcon',
  mixins: [iconMixin],
}
</script>
