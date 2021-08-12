<template>
  <BDropdown
    ref="range"
    v-b-tooltip.hover
    class="range-filter-btn"
    :title="title"
    v-bind="$attrs"
    menu-class="range-filter-dropdown-menu"
    @show="init"
  >
    <template #button-content>
      <span class="range-filter-text">{{ contentTitle }}</span>
    </template>

    <h6 class="ml-2 mr-2">
      {{ title }}
    </h6>

    <BDropdownDivider />
    <div class="p-2">
      <div class="d-flex justify-content-between align-items-center">
        <BFormInput
          v-model="range[0]"
          type="number"
          :step="interval"
          size="sm"
          class="mr-1 mb-1"
          @change="handleMinChange"
        />
        <BFormInput
          v-model="range[1]"
          type="number"
          :step="interval"
          size="sm"
          class="ml-1 mb-1"
          @change="handleMaxChange"
        />
      </div>

      <div class="d-flex justify-content-end">
        <BLink v-if="isDefaultSet" @click="handleDefault">
          <small>Default</small>
        </BLink>
        <BLink class="ml-1" @click="handleReset">
          <small>Reset</small>
        </BLink>
      </div>
    </div>

    <BDropdownDivider />

    <div class="ml-2 mr-2 text-right">
      <BButton variant="primary" size="sm" @click="handleOk"> Apply </BButton>
    </div>
  </BDropdown>
</template>

<script>
import {
  BButton,
  BDropdown,
  BDropdownDivider,
  BFormInput,
  BLink,
  VBTooltip,
} from 'bootstrap-vue'

export default {
  name: 'RangeFilter',
  components: {
    BButton,
    BDropdown,
    BDropdownDivider,
    BFormInput,
    BLink,
  },
  directives: {
    'b-tooltip': VBTooltip,
  },
  props: {
    title: {
      type: String,
      default: 'Range Filter',
    },
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 1,
    },
    value: {
      type: Array,
      default: () => [0, 1],
      validator: (value) => value.length === 2,
    },
    default: {
      type: [Array, null],
      default: null,
    },
    contentTitle: {
      type: String,
      default: 'Range',
    },
    interval: {
      type: Number,
      default: 0.1,
    },
  },
  data() {
    return {
      range: [0, 1],
    }
  },
  computed: {
    isMinValid() {
      return (
        Number(this.range[0]) >= this.min && Number(this.range[0]) <= this.max
      )
    },
    isMaxValid() {
      return (
        Number(this.range[1]) <= this.max && Number(this.range[1]) >= this.min
      )
    },
    isRangeValid() {
      return this.isMinValid && this.isMaxValid
    },
    rangeText() {
      return `Range: ${this.range[0]}-${this.range[1]}`
    },
    isDefaultSet() {
      return Array.isArray(this.default) && this.default.length === 2
    },
  },
  watch: {},
  mounted() {},
  methods: {
    handleOk() {
      this.$emit('change', [Number(this.range[0]), Number(this.range[1])])
      this.$refs.range.hide()
    },
    init() {
      this.range = this.value
    },
    handleReset() {
      this.range = [this.min, this.max]
    },
    handleDefault() {
      if (Array.isArray(this.default) && this.default.length === 2) {
        this.range = [Number(this.default[0]), Number(this.default[1])]
      }
    },
    handleMinChange(value) {
      this.$emit('minChange', Number(value))
    },
    handleMaxChange(value) {
      this.$emit('maxChange', Number(value))
    },
  },
}
</script>

<style lang="scss">
.range-filter-btn {
  & > button {
    color: #24292e;
    background-color: #fff;
    border-color: rgba(27, 31, 35, 0.15);
    border-radius: 5px;
    box-shadow: 0 1px 0 rgba(27, 31, 35, 0.04),
      inset 0 1px 0 hsla(0, 0%, 100%, 0.25);

    &:active,
    &:focus,
    &:hover {
      color: #24292e;
      background-color: #f3f4f6;
      border-color: rgba(27, 31, 35, 0.15);
    }

    &:disabled,
    &.disabled {
      color: #6c757d;
      background-color: #fff;
      border-color: #6c757d;
    }
  }
  &.show {
    & > button {
      background-color: #f3f4f6 !important;
      border-color: rgba(27, 31, 35, 0.15) !important;
    }
    & .dropdown-toggle::after {
      color: #24292e !important;
    }
  }
}

.range-filter-dropdown-menu {
  width: 200px;
  left: inherit !important;
  right: 0px;
}
</style>

<style lang="scss" scoped>
.range-filter-text {
  color: #24292e;
}
</style>
