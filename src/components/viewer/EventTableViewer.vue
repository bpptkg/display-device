<template>
  <div :class="classNames">
    <div class="d-flex justify-content-between">
      <BFormGroup
        label="Show"
        label-cols-sm="4"
        label-align-sm="right"
        label-size="sm"
        label-for="perPageSelect"
        class="col-sm-2 mb-2"
      >
        <BFormSelect
          v-model="perPage"
          size="sm"
          :options="pageOptions"
        ></BFormSelect>
      </BFormGroup>

      <BFormGroup
        label="Filter"
        label-cols-sm="4"
        label-align-sm="right"
        label-size="sm"
        label-for="filterInput"
        class="mb-2"
      >
        <BInputGroup size="sm">
          <BFormInput
            id="filterInput"
            v-model="filter"
            type="search"
            placeholder="Type to Search"
          ></BFormInput>
        </BInputGroup>
      </BFormGroup>
    </div>

    <BTable
      hover
      responsive
      show-empty
      small
      striped
      :busy="busy"
      :items="events"
      :fields="fields"
      :current-page="currentPage"
      :per-page="perPage"
      :filter="filter"
      @filtered="onFiltered"
    >
      <template #cell(actions)="row">
        <MoreMenu>
          <BDropdownItem
            v-for="(action, index) in createFeatureList(actionFeatures)"
            :key="index"
            @click="emitAction(row.item, row.index, $event.target, action)"
          >
            {{ action.label }}
          </BDropdownItem>
        </MoreMenu>
      </template>
    </BTable>

    <div class="d-flex justify-content-center">
      <BPagination
        v-model="currentPage"
        :total-rows="totalRows"
        :per-page="perPage"
        align="fill"
        size="sm"
        class="col-md-4 my-0"
      />
    </div>
  </div>
</template>

<script>
import { isString, isObject, isFunction } from 'lodash'
import {
  BDropdownItem,
  BFormGroup,
  BFormInput,
  BFormSelect,
  BInputGroup,
  BPagination,
  BTable,
} from 'bootstrap-vue'
import MoreMenu from '@/components/more-menu'

const DEFAULT_PAGE_OPTIONS = [10, 25, 50, 100, 200]

export default {
  name: 'EventTableViewer',
  components: {
    BDropdownItem,
    BFormGroup,
    BFormInput,
    BFormSelect,
    BInputGroup,
    BPagination,
    BTable,
    MoreMenu,
  },
  props: {
    events: {
      type: Array,
      default: function () {
        return []
      },
    },
    pageOptions: {
      type: Array,
      default: function () {
        return DEFAULT_PAGE_OPTIONS
      },
    },
    initialPerPage: {
      type: Number,
      default: 10,
    },
    fields: {
      type: Array,
      default: function () {
        return []
      },
    },
    busy: {
      type: Boolean,
      default: false,
    },
    viewerClass: {
      type: [Array, String, Object],
      default: null,
    },
    actionFeatures: {
      type: Array,
      default: function () {
        return []
      },
    },
  },
  data() {
    return {
      currentPage: 1,
      filter: null,
      perPage: 10,
      totalRows: 1,
    }
  },
  computed: {
    classNames() {
      return [this.viewerClass]
    },
  },
  watch: {
    events(value) {
      this.totalRows = value.length
    },
  },
  created() {
    this.perPage = this.initialPerPage
  },
  methods: {
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    emitAction(event, index, eventTarget, action) {
      this.$emit(action.type, {
        event,
        index,
        eventTarget,
        action,
      })
    },
    createFeatureList(actionFeatures, item, row) {
      const actions = []

      actionFeatures.forEach((v) => {
        const type = isString(v) ? v : isObject(v) ? v.type : ''
        const feature = {
          type,
          label: v.label || type,
        }

        if (v.checker && isFunction(v.checker)) {
          const ok = v.checker(item, row)
          if (ok) {
            actions.push(feature)
          }
        } else {
          actions.push(feature)
        }
      })

      return actions
    },
  },
}
</script>
