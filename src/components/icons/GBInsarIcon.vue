<template>
  <svg
    :width="iconSize"
    :height="iconSize"
    :viewBox="viewBox"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g>
      <!-- Rectangle Interferometer Base -->
      <rect x="8" y="10" width="12" height="4" fill="#333333" />

      <!-- Light Signals -->
      <line x1="7" y1="12" x2="2" y2="12" stroke="#4D4D4D" stroke-width="1.5" />
      <line x1="7" y1="8" x2="4" y2="6" stroke="#4D4D4D" stroke-width="1.5" />
      <line x1="7" y1="16" x2="4" y2="18" stroke="#4D4D4D" stroke-width="1.5" />

      <!-- Rectangle Interferometer -->
      <rect
        x="10"
        y="8"
        width="8"
        height="8"
        fill="none"
        stroke="#4D4D4D"
        stroke-width="1.5"
      />
    </g>
  </svg>
</template>

<script>
import iconMixin from './mixin'

export default {
  name: 'GBInsarIcon',
  mixins: [iconMixin],
}
</script>
