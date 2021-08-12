<template>
  <DButtonIcon
    :icon="icon"
    :icon-color="active ? activeIconColor : defaultIconColor"
    size="default"
    circle
    no-border
    no-shadow
    :class="classNames"
    @click="clickEvent"
  />
</template>

<script>
import DButtonIcon from '../base/button-icon/DButtonIcon'

export default {
  name: 'SidepanelTabNav',
  components: {
    DButtonIcon,
  },
  props: {
    active: {
      type: Boolean,
      default: false,
    },
    buttonStyle: {
      type: Object,
      default: function () {
        return {}
      },
    },
    icon: {
      type: Object,
      default: null,
    },
    to: {
      type: [Object, String],
      default: null,
    },
  },
  data() {
    return {
      activeIconColor: '#1a73e8',
      defaultIconColor: '#5f6368',
    }
  },
  computed: {
    classNames() {
      return [
        'nav-button',
        {
          'nav-button--active': this.active,
        },
      ]
    },
  },
  methods: {
    clickEvent() {
      if (this.to) {
        this.$router.push(this.to)
        this.$emit('nav-click')
      } else {
        this.$emit('nav-click')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.nav-button {
  &--active {
    background-color: rgba(26, 115, 232, 0.102);
  }
}
</style>
