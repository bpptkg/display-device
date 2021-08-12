<template>
  <svg
    :width="iconSize"
    :height="iconSize"
    :viewBox="viewBox"
    :fill="color"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15.705 7.41L14.295 6L8.29498 12L14.295 18L15.705 16.59L11.125 12L15.705 7.41Z"
    />
  </svg>
</template>

<script>
import iconMixin from '../mixin'

export default {
  name: 'NavigateBeforeIcon',
  mixins: [iconMixin],
}
</script>
