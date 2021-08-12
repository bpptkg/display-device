<template>
  <div>
    <div v-if="!noIcon" class="text-center">
      <slot v-if="$slots.icon" name="icon"></slot>
      <ErrorIcon v-else :size="iconSize" :color="iconColor" />
    </div>
    <div v-if="!$slots.default" class="text-center">
      <span class="align-middle">{{ message }}</span>
    </div>
    <div v-else class="text-center">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { ErrorIcon } from '../icons/alert'

export default {
  name: 'ErrorMessage',
  components: {
    ErrorIcon,
  },
  props: {
    message: {
      type: [String, Error],
      default: '',
    },
    iconColor: {
      type: String,
      default: '#3c4043',
    },
    iconSize: {
      type: String,
      default: 'md',
      validator: function (value) {
        return ['sm', 'md', 'lg', 'xl'].indexOf(value) !== -1
      },
    },
    noIcon: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
