<template>
  <component :is="iconName" v-bind="$attrs" v-on="$listeners"></component>
</template>

<script>
import DefaultIcon from './DefaultIcon'

export default {
  name: 'TemplateIcon',
  props: {
    icon: {
      type: Object,
      default: null,
    },
  },
  computed: {
    iconName() {
      if (this.icon === null || !this.icon) {
        return DefaultIcon
      } else {
        return this.icon
      }
    },
  },
}
</script>
