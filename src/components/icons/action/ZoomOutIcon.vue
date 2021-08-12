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
      d="M15.755 14.255H14.965L14.6851 13.985C15.665 12.845 16.255 11.365 16.255 9.755C16.255 6.16498 13.345 3.255 9.755 3.255C6.16504 3.255 3.255 6.16498 3.255 9.755C3.255 13.345 6.16504 16.255 9.755 16.255C11.365 16.255 12.845 15.665 13.985 14.685L14.255 14.965V15.755L19.255 20.745L20.745 19.255L15.755 14.255ZM9.755 14.255C7.26501 14.255 5.255 12.245 5.255 9.755C5.255 7.26501 7.26501 5.255 9.755 5.255C12.245 5.255 14.255 7.26501 14.255 9.755C14.255 12.245 12.245 14.255 9.755 14.255ZM12.255 9.255H7.255V10.255H12.255V9.255Z"
      fill="black"
      fill-opacity="0.54"
    />
  </svg>
</template>

<script>
import iconMixin from '../mixin'

export default {
  name: 'ZoomOutIcon',
  mixins: [iconMixin],
}
</script>
