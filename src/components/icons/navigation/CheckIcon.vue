<template>
  <svg
    :width="iconSize"
    :height="iconSize"
    :viewBox="viewBox"
    :fill="color"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.79496 15.875L4.62496 11.705L3.20496 13.115L8.79496 18.705L20.795 6.70501L19.385 5.29501L8.79496 15.875Z"
    />
  </svg>
</template>

<script>
import iconMixin from '../mixin'

export default {
  name: 'CheckIcon',
  mixins: [iconMixin],
}
</script>
