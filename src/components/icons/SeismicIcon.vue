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
      d="M11 22H13V2H11V22ZM7 18H9V6H7V18ZM5 14H3V10H5V14ZM15 18H17V6H15V18ZM19 14V10H21V14H19Z"
    />
  </svg>
</template>

<script>
import iconMixin from './mixin'

export default {
  name: 'SeismicIcon',
  mixins: [iconMixin],
}
</script>
