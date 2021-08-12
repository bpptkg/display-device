<template>
  <component
    :is="tag"
    v-if="colors.length"
    :class="classNames"
    :style="style"
  ></component>
</template>

<script>
import { generateColormap, SUPPORTED_COLORMAP } from '@/utils/color'

export default {
  name: 'ColorPalette',
  props: {
    tag: {
      type: String,
      default: 'div',
    },
    color: {
      type: [String, Array],
      default: null,
    },
    colormap: {
      type: String,
      default: null,
      validator: (name) => SUPPORTED_COLORMAP.indexOf(name) !== -1,
    },
    paletteClass: {
      type: [Array, Object, String],
      default: null,
    },
  },
  computed: {
    colors() {
      return this.colormap
        ? generateColormap(this.colormap, { nshades: 72 })
        : Array.isArray(this.color)
        ? this.color
        : typeof this.color === 'string'
        ? [this.color]
        : []
    },
    style() {
      return {
        backgroundImage: `linear-gradient(to right,${this.colors.join(',')})`,
      }
    },
    classNames() {
      return ['color-palette', this.paletteClass]
    },
  },
}
</script>

<style lang="scss" scoped>
.color-palette {
  height: 24px;
  padding: 0;
  width: 100%;
}
</style>
