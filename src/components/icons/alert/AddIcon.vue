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
      d="M12 1.25C11.17 1.25 10.5 1.92001 10.5 2.75V3.92001C7.35999 4.60001 5 7.39999 5 10.75V16.75L3 18.75V19.75H21V18.75L19 16.75V10.75C19 7.39999 16.64 4.60001 13.5 3.92001V2.75C13.5 1.92001 12.83 1.25 12 1.25ZM17 10.75C17 7.98999 14.76 5.75 12 5.75C9.23999 5.75 7 7.98999 7 10.75V17.75H17V10.75ZM12 22.75C10.9 22.75 10.01 21.86 10.01 20.76H13.99C13.99 21.86 13.1 22.75 12 22.75ZM11 7.75H13V10.75H16V12.75H13V15.75H11V12.75H8V10.75H11V7.75Z"
    />
  </svg>
</template>

<script>
import iconMixin from '../mixin'

export default {
  name: 'AddIcon',
  mixins: [iconMixin],
}
</script>
