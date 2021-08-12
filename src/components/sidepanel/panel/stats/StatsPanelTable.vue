<template>
  <div>
    <SidepanelListHeader v-if="!noTitle" class="mb-2">
      {{ title }}
    </SidepanelListHeader>
    <div
      :class="[
        'table-container',
        { 'table-container--scrollable': scrollable },
      ]"
    >
      <table :class="classNames">
        <thead>
          <tr>
            <th v-for="col in fields" :key="col.key" class="table-header">
              {{ 'label' in col ? col.label : col.key }}
            </th>
          </tr>
        </thead>
        <tbody v-if="showNoDataLabel && !items.length">
          <tr>
            <td :colspan="fields.length" class="table-empty">
              {{ noDataLabel }}
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr v-for="(row, index) in items" :key="index">
            <td v-for="col in fields" :key="col.key" class="table-data">
              {{
                col.formatter
                  ? col.formatter(get(row, col.key), row)
                  : get(row, col.key)
              }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { get } from 'lodash'
import SidepanelListHeader from '../../SidepanelListHeader'

export default {
  name: 'StatsPanelTable',
  components: {
    SidepanelListHeader,
  },
  props: {
    items: {
      type: Array,
      default: function () {
        return []
      },
    },
    fields: {
      type: Array,
      default: function () {
        return []
      },
    },
    title: {
      type: String,
      default: 'Summary',
    },
    noTitle: {
      type: Boolean,
      default: false,
    },
    bordered: {
      type: Boolean,
      default: false,
    },
    borderless: {
      type: Boolean,
      default: false,
    },
    outlined: {
      type: Boolean,
      default: false,
    },
    scrollable: {
      type: Boolean,
      default: false,
    },
    tableClass: {
      type: [Array, Object, String],
      default: null,
    },
    hover: {
      type: Boolean,
      default: false,
    },
    striped: {
      type: Boolean,
      default: false,
    },
    noDataLabel: {
      type: String,
      default: 'No data',
    },
    showNoDataLabel: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    classNames() {
      return [
        'panel-table',
        {
          'panel-table-outlined': this.outlined,
          'panel-table-bordered': this.bordered,
          'panel-table-borderless': this.borderless,
          'panel-table--hover': this.hover,
          'panel-table--striped': this.striped,
        },
        this.tableClass,
      ]
    },
  },
  methods: {
    get(object, path) {
      if (object.default) {
        return get(object, path, object.default)
      } else {
        return get(object, path)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
$border: 1px solid #dee2e6;

.table-container {
  width: 100%;
  height: 100%;

  &--scrollable {
    overflow-x: auto;
  }
}

.table-empty {
  text-align: center !important;
  font-size: 12px;
  color: #202124;
}

.panel-table {
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 1rem;
  color: #202124;

  & thead,
  th {
    vertical-align: bottom;
  }

  & th,
  td {
    padding: 0.6rem;
    vertical-align: top;
    text-align: left;
    border-bottom: $border;
    white-space: nowrap;
  }

  &--hover {
    tr:hover {
      background-color: #f1f3f4;
    }
  }

  &--striped {
    tr:nth-child(even) {
      background-color: #f2f2f2;
    }
  }

  &-outlined {
    border: $border;
  }

  &-bordered {
    table,
    th,
    tr,
    td {
      border: $border;
    }
  }
}

.table-header {
  font-size: 12px;
  font-weight: normal;
  color: #5f6368;
}

.table-data {
  font-size: 12px;
  color: #202124;
}
</style>
