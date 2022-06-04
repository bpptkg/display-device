<template>
  <svg
    w:width="iconSize"
    :height="iconSize"
    :viewBox="viewBox"
    :fill="color"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M12 2C13.66 2 15 3.34 15 5V13C16.21 13.91 17 15.37 17 17C17 19.76 14.76 22 12 22C9.23999 22 7 19.76 7 17C7 15.37 7.79001 13.91 9 13V5C9 3.34 10.34 2 12 2ZM12 4C11.45 4 11 4.45 11 5V11H13V9H12V8H13V6H12V5H13C13 4.45 12.55 4 12 4Z"
    />
  </svg>
</template>

<script>
import iconMixin from './mixin'

export default {
  name: 'ThermalIcon',
  mixins: [iconMixin],
}
</script>
