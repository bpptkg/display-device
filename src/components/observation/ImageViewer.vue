<template>
  <Viewer :images="images" :options="options" @inited="inited">
    <template slot-scope="scope">
      <div v-for="img in scope.images" :key="img.src" class="img-thumbnail">
        <ImageThumbnail :src="img.src" />
      </div>
    </template>
  </Viewer>
</template>

<script>
import Viewer from 'v-viewer/src/component'
import ImageThumbnail from './ImageThumbnail'

export default {
  name: 'ImageViewer',
  components: {
    ImageThumbnail,
    Viewer,
  },
  props: {
    images: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      options: {
        rotatable: false,
        movable: true,
        scalable: false,
      },
    }
  },
  methods: {
    inited(viewer) {
      this.$viewer = viewer
    },
  },
}
</script>

<style lang="scss" scoped>
.img-thumbnail {
  display: inline-block;
  margin: 5px 5px;
  cursor: pointer;
}
</style>

<style lang="scss">
// We need to load patched SCSS from viewerjs libary.
@import '@/lib/viewerjs/index';
</style>
