<template>
  <BButton class="btn-icon" :class="classNames">
    <BSpinner v-show="busy" small variant="secondary" />
    <TemplateIcon
      v-show="!busy"
      :size="iconSize"
      :icon="icon"
      :color="iconColor"
    />
  </BButton>
</template>

<script>
import { BButton, BSpinner } from 'bootstrap-vue'
import { DefaultIcon, TemplateIcon } from '../../icons'

const buttonSize = Object.freeze({
  default: 'default',
  small: 'sm',
  medium: 'md',
  large: 'lg',
})

export default {
  name: 'DButtonIcon',
  components: {
    BButton,
    BSpinner,
    TemplateIcon,
  },
  props: {
    active: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: Object,
      default: DefaultIcon,
    },
    iconColor: {
      type: String,
      default: '#5f6368',
    },
    iconSize: {
      type: String,
      default: 'default',
    },
    size: {
      type: String,
      default: 'default',
      validator: function (value) {
        return Object.values(buttonSize).indexOf(value) !== -1
      },
    },
    noBorder: {
      type: Boolean,
      default: false,
    },
    circle: {
      type: Boolean,
      default: false,
    },
    noShadow: {
      type: Boolean,
      default: false,
    },
    busy: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    classNames() {
      return {
        'btn-icon--circle': this.circle,
        'btn-icon--no-border': this.noBorder,
        'btn-icon--no-shadow': this.noShadow,
        'btn-icon-default': this.size === buttonSize.default,
        'btn-icon-small': this.size === buttonSize.small,
        'btn-icon-md': this.size === buttonSize.medium,
        'btn-icon-lg': this.size === buttonSize.large,
        'btn-icon--active': this.active,
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.btn-icon {
  background-color: #fff;
  border: 1px solid #dadada;
  padding: 0;
  width: 32px;
  height: 32px;
  border-radius: 5px;
  box-shadow: 0 1px 0 rgba(27, 31, 35, 0.04),
    inset 0 1px 0 hsla(0, 0%, 100%, 0.25);

  &:hover {
    background-color: #f3f4f6;
    border-color: rgba(27, 31, 35, 0.15);
  }

  &:active,
  &.active {
    background-color: #f3f4f6 !important;
    border-color: rgba(27, 31, 35, 0.15) !important;
  }

  &:focus {
    box-shadow: none !important;
    background-color: #f3f4f6;
    border: none;
  }

  &:disabled,
  &.disabled,
  fieldset:disabled & {
    pointer-events: none;
  }

  &--active {
    background-color: #e9e9e9;
  }

  &--circle {
    border-radius: 50%;
  }

  &--no-border {
    border: none;
    box-shadow: none;
  }

  &--no-shadow {
    box-shadow: none;
  }
}

.btn-icon-default {
  width: 32px;
  height: 32px;
}

.btn-icon-small {
  width: 24px;
  height: 24px;
}

.btn-icon-md {
  width: 40px;
  height: 40px;
}

.btn-icon-lg {
  width: 48px;
  height: 48px;
}
</style>
