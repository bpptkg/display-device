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
      d="M2 12C2 6.48 6.47998 2 12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.47998 22 2 17.52 2 12ZM13 16V18H11V16H13ZM12 20C7.58997 20 4 16.41 4 12C4 7.59 7.58997 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM8 10C8 7.79 9.79004 6 12 6C14.21 6 16 7.79 16 10C16 11.2829 15.21 11.9733 14.4408 12.6455C13.7111 13.2833 13 13.9046 13 15H11C11 13.1787 11.9421 12.4566 12.7704 11.8217C13.4203 11.3236 14 10.8792 14 10C14 8.9 13.1 8 12 8C10.9 8 10 8.9 10 10H8Z"
    />
  </svg>
</template>

<script>
import iconMixin from '../mixin'

export default {
  name: 'HelpOutlineIcon',
  mixins: [iconMixin],
}
</script>
