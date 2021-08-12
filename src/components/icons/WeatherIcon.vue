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
      d="M11 1.04999H13V4H11V1.04999ZM4.96008 3.54999L6.76001 5.34L5.34009 6.75L3.55005 4.95999L4.96008 3.54999ZM4 11H1V13H4V11ZM20.4475 4.952L19.0404 3.54498L17.2515 5.33389L18.6586 6.741L20.4475 4.952ZM17.24 18.66L19.03 20.46L20.4399 19.05L18.64 17.26L17.24 18.66ZM23 11H20V13H23V11ZM12 6C8.68994 6 6 8.69 6 12C6 15.31 8.68994 18 12 18C15.3101 18 18 15.31 18 12C18 8.69 15.3101 6 12 6ZM8 12C8 14.21 9.79004 16 12 16C14.21 16 16 14.21 16 12C16 9.79001 14.21 8 12 8C9.79004 8 8 9.79001 8 12ZM13 20V22.95H11V20H13ZM4.96008 20.45L3.55005 19.04L5.34009 17.24L6.75 18.65L4.96008 20.45Z"
    />
  </svg>
</template>

<script>
import iconMixin from './mixin'

export default {
  name: 'WeatherIcon',
  mixins: [iconMixin],
}
</script>
