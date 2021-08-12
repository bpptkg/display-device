<template>
  <svg
    :width="iconSize"
    :height="iconSize"
    :viewBox="viewBox"
    :fill="color"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 8.29501L6 14.295L7.41 15.705L12 11.125L16.59 15.705L18 14.295L12 8.29501Z"
    />
  </svg>
</template>

<script>
import iconMixin from '../mixin'

export default {
  name: 'ExpandLessIcon',
  mixins: [iconMixin],
}
</script>
