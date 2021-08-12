<template>
  <BDropdown
    ref="filter"
    v-b-tooltip.hover
    class="ef-btn"
    size="sm"
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
      <input v-model="checkedAll" type="checkbox" @change="toggleCheckAll" />
      <label class="filter-label">All</label>
    </div>

    <div class="dropdown-body filter-body">
      <div v-for="(filter, index) in options" :key="index" class="filter-item">
        <input v-model="filter.checked" type="checkbox" />
        <label class="filter-label">
          {{ filter.label || filter.name }}
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
import { FilterListIcon } from '@/components/icons/content'

export default {
  name: 'EventFilter',
  components: {
    FilterListIcon,
    BButton,
    BDropdown,
    BDropdownDivider,
  },
  directives: {
    'b-tooltip': VBTooltip,
  },
  props: {
    events: {
      type: Array,
      default: function () {
        return []
      },
    },
    title: {
      type: String,
      default: 'Event Filter',
    },
  },
  data() {
    return {
      checkedAll: false,
      options: [],
    }
  },
  methods: {
    toggleCheckAll() {
      this.options.forEach((v) => {
        v.checked = this.checkedAll
      })
    },
    handleOk() {
      this.$emit('change', this.options)
      this.$refs.filter.hide()
    },
    init() {
      // Creating a new object to prevent reference overwrite.
      this.options = this.events.map((v) => {
        return { ...v }
      })
      this.checkedAll = this.events.every((v) => v.checked === true)
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
