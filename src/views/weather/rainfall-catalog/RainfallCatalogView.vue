<template>
  <BContainer class="content">
    <BCard v-if="error">
      <ErrorMessage>
        <p>Unable to load data.</p>
        <p>Error: {{ error.message }}</p>
        <p>
          <BLink @click="update"> Try again </BLink>
        </p>
      </ErrorMessage>
    </BCard>

    <BCard v-show="!error" :title="title">
      <div class="d-flex flex-wrap justify-content-between">
        <div class="d-flex flex-wrap">
          <RangeSelector
            ref="range-selector"
            size="sm"
            :custom-enabled="true"
            :selected="period"
            :items="rangeSelector"
            :max-custom-duration="maxCustomDuration"
            @period-selected="onPeriodChange"
            class="form-label"
          />

          <BFormGroup class="ml-2">
            <BFormSelect
              v-model="selectedStation"
              size="sm"
              :options="stationOptions"
            />
          </BFormGroup>

          <BFormGroup class="ml-2">
            <DButtonIcon
              v-b-tooltip.hover
              :busy="isRefreshing"
              :icon="RefreshIcon"
              no-shadow
              title="Refresh table"
              @click.native="update"
            />
          </BFormGroup>

          <BFormGroup class="ml-2">
            <DButtonIcon
              v-b-tooltip.hover
              :busy="isDownloading"
              :icon="SaveAltIcon"
              no-shadow
              title="Download table"
              @click.native="downloadData"
            />
          </BFormGroup>
        </div>
      </div>

      <BTable
        small
        striped
        hover
        responsive
        show-empty
        :busy="busy"
        :items="data"
        :fields="fieldOptions"
      />
      <div>
        <p class="text-muted">Number of records: {{ data.length }}</p>
      </div>
    </BCard>
  </BContainer>
</template>

<script>
import {
  BCard,
  BContainer,
  BFormGroup,
  BFormSelect,
  BLink,
  BTable,
  VBTooltip,
} from 'bootstrap-vue'
import { mapState, mapActions, mapMutations } from 'vuex'
import ErrorMessage from '../../../components/error-message'
import DButtonIcon from '../../../components/base/button-icon/DButtonIcon'
import { SaveAltIcon } from '../../../components/icons/content'
import { RefreshIcon } from '../../../components/icons/navigation'
import { createCSVContent } from '@/utils/bulletin'
import { saveAs } from '../../../lib/file-saver'
import RangeSelector from '../../../components/range-selector'
import { DateRangeTypes } from '../../../constants/date'
import {
  SET_END_TIME,
  SET_PERIOD,
  SET_START_TIME,
} from '../../../store/base/mutations'

import fieldOptions from '../../../store/rainfall-catalog/field-options'
import stationOptions from '../../../store/rainfall-catalog/station-options'
import rangeSelector, {
  maxCustomDuration,
} from '../../../store/rainfall-catalog/range-selector'
import {
  FETCH_DATA,
  SET_STATION,
  UPDATE_DATA,
} from '../../../store/rainfall-catalog'

export default {
  name: 'RainfallCatalogView',

  components: {
    BCard,
    BContainer,
    BFormGroup,
    BFormSelect,
    BLink,
    BTable,
    DButtonIcon,
    ErrorMessage,
    RangeSelector,
  },

  directives: {
    'b-tooltip': VBTooltip,
  },

  data() {
    return {
      busy: false,
      isDownloading: false,
      isRefreshing: false,
      SaveAltIcon,
      RefreshIcon,
      fieldOptions,
      stationOptions,
      maxCustomDuration,
      rangeSelector,
    }
  },

  computed: {
    ...mapState('rainfallCatalog', {
      data: (state) => state.data,
      station: (state) => state.station,
      period: (state) => state.period,
      startTime: (state) => state.startTime,
      endTime: (state) => state.endTime,
      error: (state) => state.error,
    }),

    selectedStation: {
      get() {
        return this.station
      },
      set(value) {
        this.setStation(value)
        this.update()
      },
    },

    title() {
      const station = this.stationOptions.find(
        (item) => item.value === this.station
      ).text

      return `Rainfall Catalog ${station}`
    },

    namespace: () => 'rainfallCatalog',
  },

  methods: {
    ...mapMutations({
      setStation(commit, value) {
        commit(this.namespace + '/' + SET_STATION, value)
      },
      setPeriod(commit, period) {
        return commit(this.namespace + '/' + SET_PERIOD, period)
      },
      setStartTime(commit, value) {
        return commit(this.namespace + '/' + SET_START_TIME, value)
      },
      setEndTime(commit, value) {
        return commit(this.namespace + '/' + SET_END_TIME, value)
      },
    }),

    ...mapActions({
      fetchData(dispatch) {
        return dispatch(this.namespace + '/' + FETCH_DATA)
      },
      updateData(dispatch) {
        return dispatch(this.namespace + '/' + UPDATE_DATA)
      },
    }),

    async update() {
      this.busy = true
      this.fetchData().finally(() => {
        this.busy = false
      })
    },

    onPeriodChange(period, { startTime, endTime }) {
      if (period.type === DateRangeTypes.CUSTOM) {
        this.setPeriod(period)
        this.setStartTime(startTime)
        this.setEndTime(endTime)
        this.update()
      } else {
        this.setPeriod(period)
        this.update()
      }
    },

    async downloadData() {
      const blob = new Blob([createCSVContent(this.data)], {
        type: 'text/csv;charset=utf-8',
      })

      saveAs(blob, `rainfall-catalog-${this.station}.csv`)
    },
  },

  mounted() {
    this.update()
  },
}
</script>

<style scoped>
.content {
  margin-top: 60px;
  padding: 10px;
}
</style>
