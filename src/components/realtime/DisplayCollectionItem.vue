<template>
  <BLink :to="to">
    <BCard
      :img-src="imgSrc"
      :img-alt="title"
      :img-top="isImagePositionTo(ImagePosition.TOP)"
      :img-bottom="isImagePositionTo(ImagePosition.BOTTOM)"
      :img-left="isImagePositionTo(ImagePosition.LEFT)"
      :img-right="isImagePositionTo(ImagePosition.RIGHT)"
      :class="itemClassNames"
    >
      <template #header>
        <component :is="titleTag" :class="titleClassNames">
          {{ title }}
        </component>
      </template>
    </BCard>
  </BLink>
</template>

<script>
import { BCard, BCardText, BLink } from 'bootstrap-vue'

const ImagePosition = {
  TOP: 'top',
  BOTTOM: 'bottom',
  LEFT: 'left',
  RIGHT: 'right',
}

export default {
  name: 'DisplayCollectionItem',
  components: {
    BCard,
    BCardText,
    BLink,
  },
  props: {
    to: {
      type: String,
      default: null,
    },
    itemClass: {
      type: [String, Array, Object],
      default: null,
    },
    title: {
      type: String,
      default: '',
    },
    titleTag: {
      type: String,
      default: 'h6',
    },
    titleClass: {
      type: [String, Array, Object],
      default: null,
    },
    imgSrc: {
      type: String,
      default: null,
    },
    imgPosition: {
      type: String,
      default: ImagePosition.BOTTOM,
      validator: (value) => Object.values(ImagePosition).indexOf(value) !== -1,
    },
  },
  data() {
    return {
      ImagePosition,
    }
  },
  computed: {
    itemClassNames() {
      return ['collection-item', this.itemClass]
    },
    titleClassNames() {
      return ['collection-item-title', this.titleClass]
    },
  },
  methods: {
    isImagePositionTo(expect) {
      switch (expect) {
        case ImagePosition.TOP:
          return this.imgPosition === ImagePosition.TOP
        case ImagePosition.BOTTOM:
          return this.imgPosition === ImagePosition.BOTTOM
        case ImagePosition.LEFT:
          return this.imgPosition === ImagePosition.LEFT
        case ImagePosition.RIGHT:
          return this.imgPosition === ImagePosition.RIGHT
        default:
          return false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.collection-item {
  box-shadow: 0 1px 2px 0 rgb(60 64 67 / 30%), 0 2px 4px 2px rgb(60 64 67 / 15%);
  background: #fff;
  border-radius: 10px;

  img {
    aspect-ratio: 1/1;
  }
}

.collection-item-title {
  color: #212529;
}
</style>
