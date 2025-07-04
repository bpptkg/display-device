<template>
  <svg
    :width="iconSize"
    :height="iconSize"
    :viewBox="viewBox"
    :fill="color"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      id="icon/maps/compass_calibration_24px"
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M12 2.5C8.09998 2.5 4.56006 4.09 2 6.64999L7 11.65C8.28003 10.37 10.05 9.57001 12 9.57001C13.95 9.57001 15.72 10.36 17 11.64L22 6.64001C19.4399 4.09 15.9 2.5 12 2.5ZM7 16.5C7 13.74 9.23999 11.5 12 11.5C14.76 11.5 17 13.74 17 16.5C17 19.26 14.76 21.5 12 21.5C9.23999 21.5 7 19.26 7 16.5ZM9 16.5C9 18.15 10.35 19.5 12 19.5C13.65 19.5 15 18.15 15 16.5C15 14.85 13.65 13.5 12 13.5C10.35 13.5 9 14.85 9 16.5ZM12 7.57001C13.74 7.57001 15.3999 8.06 16.84 8.97L19.0499 6.76001C17 5.29001 14.5599 4.5 12 4.5C9.43994 4.5 6.98999 5.29001 4.93994 6.76001L7.1499 8.98001C8.58997 8.06 10.2599 7.57001 12 7.57001Z"
    />
  </svg>
</template>

<script>
import iconMixin from './mixin'

export default {
  name: 'FogIcon',
  mixins: [iconMixin],
}
</script>
