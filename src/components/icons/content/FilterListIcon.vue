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
      d="M3 6V8H21V6H3ZM10 18H14V16H10V18ZM18 13H6V11H18V13Z"
    />
  </svg>
</template>

<script>
import iconMixin from '../mixin'

export default {
  name: 'FilterListIcon',
  mixins: [iconMixin],
}
</script>
