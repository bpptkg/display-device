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
      d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM7 9C7 6.23999 9.23999 4 12 4C14.76 4 17 6.23999 17 9C17 11.88 14.12 16.19 12 18.88C9.92004 16.21 7 11.85 7 9ZM9.5 9C9.5 7.61929 10.6193 6.5 12 6.5C12.8932 6.5 13.7185 6.9765 14.165 7.75C14.6117 8.5235 14.6117 9.4765 14.165 10.25C13.7185 11.0235 12.8932 11.5 12 11.5C10.6193 11.5 9.5 10.3807 9.5 9Z"
    />
  </svg>
</template>

<script>
import iconMixin from '../mixin'

export default {
  name: 'RoomIcon',
  mixins: [iconMixin],
}
</script>
