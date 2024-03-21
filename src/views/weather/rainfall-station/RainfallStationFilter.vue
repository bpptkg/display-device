<template>
  <BDropdown
    ref="filter"
    v-b-tooltip.hover
    size="sm"
    class="ef-btn"
    v-bind="$attrs"
    :title="title"
    @shown="init"
  >
    <template #button-content>
      <FilterListIcon color="#5f6368" />
    </template>

    <h6 class="ml-2 mr-2">
      {{ title }}
    </h6>

    <BDropdownDivider />

    <div class="dropdown-body">
      <div v-for="(filter, index) in options" :key="index" class="filter-item">
        <BFormCheckbox
          v-model="filter.isVisible"
          @change="(value) => handleChange(value, index)"
          >{{ filter.stationLabel }}</BFormCheckbox
        >
      </div>
    </div>
  </BDropdown>
</template>

<script>
import {
  BDropdown,
  BDropdownDivider,
  VBTooltip,
  BFormCheckbox,
} from 'bootstrap-vue'
import { FilterListIcon } from '@/components/icons/content'

export default {
  name: 'EventFilter',
  components: {
    FilterListIcon,
    BDropdown,
    BDropdownDivider,
    BFormCheckbox,
  },
  directives: {
    'b-tooltip': VBTooltip,
  },
  props: {
    items: {
      type: Array,
      default: function () {
        return []
      },
    },
    title: {
      type: String,
      default: 'Subplots',
    },
  },
  data() {
    return {
      checkedAll: false,
      options: [],
    }
  },
  methods: {
    handleChange(value, index) {
      const visibleCount = this.options.filter((v) => v.isVisible).length
      if (visibleCount === 0 && !value) {
        alert('Visible chart must be at least 1.')
        this.options[index].isVisible = true
      } else {
        this.$emit('change', { index, isVisible: value })
      }
    },
    init() {
      // Creating a new object to prevent reference overwrite.
      this.options = this.items.map((v) => {
        return { ...v }
      })
      this.checkedAll = this.items.every((v) => v.isVisible === true)
    },
  },
}
</script>

<style lang="scss">
.ef-btn {
  & > button {
    color: #24292e;
    background-color: #fff;
    border-color: rgba(27, 31, 35, 0.15);
    border-radius: 5px;
    box-shadow: 0 1px 0 rgba(27, 31, 35, 0.04),
      inset 0 1px 0 hsla(0, 0%, 100%, 0.25);
    padding: 5px;
    height: 31px;

    &:active,
    &:focus,
    &:hover {
      color: #24292e;
      background-color: #f3f4f6;
      border-color: rgba(27, 31, 35, 0.15);
    }

    :disabled,
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
</style>

<style lang="scss" scoped>
.dropdown-body {
  padding-left: 10px;
  padding-right: 10px;
  display: flex;
  flex-direction: column;
  width: max-content;
}

.filter-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  overflow: auto;
  width: 200px;
}

.filter-item {
  display: flex;
  align-items: center;
}

.filter-line {
  margin: 15px 0 15px 5px;
}

.filter-label {
  font-size: 0.875rem;
  margin-bottom: 0;
  margin-left: 5px;
}
</style>
