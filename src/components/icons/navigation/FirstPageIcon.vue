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
      d="M7.79504 6H5.79504V18H7.79504V6ZM13.615 12L18.2051 16.59L16.795 18L10.795 12L16.795 6L18.2051 7.41L13.615 12Z"
    />
  </svg>
</template>

<script>
import iconMixin from '../mixin'

export default {
  name: 'FirstPageIcon',
  mixins: [iconMixin],
}
</script>
