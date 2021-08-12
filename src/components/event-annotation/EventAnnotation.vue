<template>
  <BDropdown
    ref="annotation"
    v-b-tooltip.hover
    class="ea-btn"
    size="sm"
    :title="title"
    @shown="init"
  >
    <template #button-content>
      <AnnotationIcon color="#5f6368" />
    </template>

    <h6 class="ml-2 mr-2">
      {{ title }}
    </h6>

    <BDropdownDivider />

    <div class="dropdown-body">
      <input v-model="checkedAll" type="checkbox" @change="toggleCheckAll" />
      <label class="annotation-label">All</label>
    </div>

    <div class="dropdown-body annotation-body">
      <div
        v-for="(annotation, index) in options"
        :key="index"
        class="annotation-item"
      >
        <input v-model="annotation.checked" type="checkbox" />
        <hr class="annotation-line" :style="createLineStyle(annotation)" />
        <label class="annotation-label">
          {{ annotation.label || annotation.name }}
        </label>
      </div>
    </div>

    <BDropdownDivider />

    <div class="ml-2 mr-2 text-right">
      <BButton variant="primary" size="sm" @click="handleOk"> Apply </BButton>
    </div>
  </BDropdown>
</template>

<script>
import { BDropdown, BDropdownDivider, BButton, VBTooltip } from 'bootstrap-vue'
import { AnnotationIcon } from '@/components/icons/action'

export default {
  name: 'EventAnnotation',
  components: {
    AnnotationIcon,
    BButton,
    BDropdown,
    BDropdownDivider,
  },
  directives: {
    'b-tooltip': VBTooltip,
  },
  props: {
    annotations: {
      type: Array,
      default: function () {
        return []
      },
    },
    title: {
      type: String,
      default: 'Event Annotation',
    },
  },
  data() {
    return {
      checkedAll: false,
      options: [],
    }
  },
  methods: {
    createLineStyle(annotation) {
      const { lineStyle = 'dashed', color = 'black' } = annotation
      return {
        border: `1px ${lineStyle} ${color}`,
        width: '15px',
      }
    },
    toggleCheckAll() {
      this.options.forEach((v) => {
        v.checked = this.checkedAll
      })
    },
    handleOk() {
      this.$emit('change', this.options)
      this.$refs.annotation.hide()
    },
    init() {
      // Creating a new object prevents reference overwrite.
      this.options = this.annotations.map((v) => {
        return { ...v }
      })
      this.checkedAll = this.annotations.every((v) => v.checked === true)
    },
  },
}
</script>

<style lang="scss">
.ea-btn {
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
</style>

<style lang="scss" scoped>
.dropdown-body {
  padding-left: 10px;
  padding-right: 10px;
}

.annotation-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  overflow: auto;
  width: 250px;
}

.annotation-item {
  display: flex;
  align-items: center;
}

.annotation-line {
  margin: 15px 0 15px 5px;
}

.annotation-label {
  font-size: 0.875rem;
  margin-bottom: 0;
  margin-left: 5px;
}
</style>
