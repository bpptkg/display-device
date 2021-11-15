<template>
  <div
    v-b-tooltip.hover
    class="chips"
    :class="classNames"
    @click="emitClick"
    :title="tooltip || text"
  >
    {{ text }}
  </div>
</template>

<script>
import { VBTooltip } from 'bootstrap-vue'

export default {
  name: 'Chips',
  directives: {
    'b-tooltip': VBTooltip,
  },
  props: {
    text: {
      type: String,
      default: '',
    },
    active: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Number,
    },
    tooltip: {
      type: String,
      default: '',
    },
  },
  computed: {
    classNames() {
      return {
        active: this.active,
      }
    },
  },
  methods: {
    emitClick() {
      if (this.value) {
        this.$emit('click', this.value)
      } else {
        this.$emit('click')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.chips {
  padding: 5px;
  color: #6a6a6a;
  border: 1px solid #eaeaea;
  border-radius: 5px;
  display: inline-block;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  line-height: 1.5;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;

  &.active {
    background-color: #e3e3e3;
  }
}
</style>
