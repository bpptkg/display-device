<template>
  <div class="d-flex justify-content-between flex-wrap">
    <div class="d-flex flex-wrap">
      <TemplateIcon
        v-if="item.icon"
        :icon="itemIcon"
        :color="iconColor"
        class="mr-2 text"
      />
      <div :class="{ 'text-bold': itemLabelBold }">
        {{ label }}
      </div>
    </div>
    <span class="text" :class="{ 'text-bold': itemTextBold }">{{ text }}</span>
  </div>
</template>

<script>
import { TemplateIcon } from '@/components/icons'

export default {
  name: 'LatestRecordItem',
  components: {
    TemplateIcon,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
    itemLabelBold: {
      type: Boolean,
      default: false,
    },
    itemTextBold: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    text() {
      const { value } = this.item
      if (this.item.valueSuffix) {
        return `${value}${this.item.valueSuffix}`
      } else {
        return value
      }
    },
    label() {
      return this.item.label ? this.item.label : ''
    },
    itemIcon() {
      return this.item.icon && this.item.icon.icon
        ? this.item.icon.icon
        : this.item.icon
    },
    iconColor() {
      return this.item.icon && this.item.icon.color
        ? this.item.icon.color
        : 'currentColor'
    },
  },
}
</script>

<style lang="scss" scoped>
.text {
  color: #3c4043;

  &-bold {
    font-weight: 500;
  }
}
</style>
