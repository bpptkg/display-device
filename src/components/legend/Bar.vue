<template>
  <div class="d-flex justify-content-center align-items-center">
    <div :style="barStyle"></div>
    <div style="margin-left: 5px; font-size: 0.75rem">{{ label }}</div>
  </div>
</template>

<script>
export default {
  name: 'Bar',
  props: {
    width: {
      type: String,
      default: '15',
    },
    height: {
      type: String,
      default: '10',
    },
    color: {
      type: String,
      default: 'blue',
    },
    label: {
      type: String,
      default: 'bar',
    },
  },
  computed: {
    barStyle() {
      return {
        width: `${this.width}px`,
        height: `${this.height}px`,
        backgroundColor: this.color,
      }
    },
  },
}
</script>
