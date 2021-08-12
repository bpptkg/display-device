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
      d="M12,3L4,9v12h16V9L12,3z M18,19h-3v-6H9v6H6v-9l6-4.5l6,4.5V19z"
    />
  </svg>
</template>

<script>
import iconMixin from './mixin'

export default {
  name: 'HomeIcon',
  mixins: [iconMixin],
}
</script>
