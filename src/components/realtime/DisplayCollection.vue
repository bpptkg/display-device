<template>
  <div>
    <BRow class="mb-2">
      <BCol>
        <component :is="titleTag">
          {{ title }}
        </component>
      </BCol>
    </BRow>
    <BRow v-for="(row, i) in itemList" :key="i">
      <BCol v-for="item in row" :key="item.to" :md="columnSize" class="mb-3">
        <DisplayCollectionItem
          :to="item.to"
          :title="item.title"
          :img-src="item.imgSrc"
        />
      </BCol>
    </BRow>
  </div>
</template>

<script>
import { BRow, BCol } from 'bootstrap-vue'
import { gridFromListByColumn } from '@/utils/layout'

import DisplayCollectionItem from './DisplayCollectionItem'

export default {
  name: 'DisplayCollection',
  components: {
    BCol,
    BRow,
    DisplayCollectionItem,
  },
  props: {
    ncol: {
      type: Number,
      default: 3,
    },
    title: {
      type: String,
      default: 'Collections',
    },
    titleTag: {
      type: String,
      default: 'h6',
    },
    items: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    columnSize() {
      return Math.floor(12 / this.ncol)
    },
    itemList() {
      return gridFromListByColumn(this.items, this.ncol)
    },
  },
}
</script>
