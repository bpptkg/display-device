export const iconSizeOptions = Object.freeze({
  default: 'default',
  sm: 'small',
  md: 'medium',
  lg: 'large',
  xl: 'extralarge',
  small: 'small',
  medium: 'medium',
  large: 'large',
  extralarge: 'extralarge',
})

export const iconSize = Object.freeze({
  default: 24,
  small: 16,
  medium: 32,
  large: 48,
  extralarge: 64,
})

const iconDefaultColor = 'currentColor'
const iconDefaultViewBox = '0 0 24 24'

export default {
  props: {
    size: {
      type: String,
      default: iconSizeOptions.default,
      validator: (value) => Object.keys(iconSizeOptions).includes(value),
    },
    color: {
      type: String,
      default: iconDefaultColor,
    },
    viewBox: {
      type: String,
      default: iconDefaultViewBox,
    },
  },
  computed: {
    iconSize() {
      return iconSize[iconSizeOptions[this.size]]
    },
  },
}
