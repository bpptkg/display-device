<template>
  <img :src="src" :alt="alt" style="height: 75px" />
</template>

<script>
export default {
  name: 'ImageThumbnail',
  props: {
    src: {
      type: String,
      default: null,
    },
    alt: {
      type: String,
      default: null,
    },
  },
}
</script>
