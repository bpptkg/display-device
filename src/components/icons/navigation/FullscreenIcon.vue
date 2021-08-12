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
      d="M7 10H5V5H10V7H7V10ZM5 14H7V17H10V19H5V14ZM17 17H14V19H19V14H17V17ZM14 7V5H19V10H17V7H14Z"
    />
  </svg>
</template>

<script>
import iconMixin from '../mixin'

export default {
  name: 'FullscreenIcon',
  mixins: [iconMixin],
}
</script>
