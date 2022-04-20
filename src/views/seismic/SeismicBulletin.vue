<template>
  <div class="bulletin-view">
    <h5>Seismic Bulletin</h5>

    <ErrorMessage v-if="error">
      <p>Unable to load data.</p>
      <p>Error: {{ error.message }}</p>
      <p>
        <BLink @click="update"> Try again </BLink>
      </p>
    </ErrorMessage>

    <div v-show="!error">
      <div class="d-flex flex-wrap justify-content-between">
        <div class="d-flex flex-wrap">
          <BFormGroup label="">
            <BFormSelect
              v-b-tooltip.hover
              title="Number of items per page"
              v-model="perPage"
              size="sm"
              :options="pageOptions"
            ></BFormSelect>
          </BFormGroup>

          <BFormGroup label="" class="ml-2">
            <DButtonIcon
              v-b-tooltip.hover
              :icon="FilterListIcon"
              no-shadow
              title="Show filter options"
              @click.native="showFilterOptions"
            />
          </BFormGroup>

          <BFormGroup class="ml-2">
            <DButtonIcon
              v-b-tooltip.hover
              :busy="isRefreshing"
              :icon="RefreshIcon"
              no-shadow
              title="Refresh table"
              @click.native="refreshTable"
            />
          </BFormGroup>

          <BFormGroup class="ml-2">
            <DButtonIcon
              v-b-tooltip.hover
              :busy="isDownloading"
              :icon="SaveAltIcon"
              no-shadow
              title="Download table"
              @click.native="downloadEventsCSV"
            />
          </BFormGroup>
        </div>

        <BFormGroup label="">
          <BInputGroup size="sm">
            <BFormInput
              id="filterInput"
              v-model="filter"
              type="search"
              placeholder="Search table"
            ></BFormInput>
          </BInputGroup>
        </BFormGroup>
      </div>

      <div class="bulletin-table">
        <BTable
          small
          striped
          hover
          responsive
          show-empty
          :busy="busy"
          :items="data"
          :fields="fieldOptions"
          :per-page="perPage"
          :filter="filter"
          @filtered="onFiltered"
          @context-changed="onContextChanged"
        >
          <template #cell(actions)="row">
            <MoreMenu>
              <BDropdownItem @click="showDetails(row.item)">
                Show details
              </BDropdownItem>
            </MoreMenu>
          </template>
        </BTable>
      </div>

      <BModal ref="dialog" size="lg" hide-footer title="Event Information">
        <BTabs>
          <BTab title="Details" lazy class="info-container">
            <ul>
              <li v-for="(item, key) in labelOptions" :key="key">
                <span class="font-weight-bold"> {{ item.label }} </span>:
                {{
                  item.formatter
                    ? item.formatter(
                        item.useField ? event[item.useField] : event[key],
                        key,
                        event
                      )
                    : event[key]
                }}
              </li>
            </ul>
          </BTab>

          <BTab class="hypoview-container" title="Hypocenter" lazy>
            <HypocenterViewer v-if="isPlottableEvent" :events="event" lazy />
            <div
              v-else
              class="h-100 d-flex align-items-center justify-content-center"
            >
              <ErrorMessage> This hypocenter is not plottable. </ErrorMessage>
            </div>
          </BTab>

          <BTab title="Cluster">
            <ClusterMediaImageViewer :event-id="event.eventid" />
            <ClusterMediaStream class="mt-2" :event-id="event.eventid" />
          </BTab>
        </BTabs>
      </BModal>

      <BModal ref="filterOptions" size="sm" title="Filter Options">
        <BFormGroup label="Event type">
          <BFormSelect
            v-model="filterEventType"
            size="sm"
            :options="eventTypesFilter"
          ></BFormSelect>
        </BFormGroup>

        <BFormGroup label="Sort event date">
          <BFormSelect
            v-model="filterEventDateSortMode"
            size="sm"
            :options="eventDateSortModeOptions"
          ></BFormSelect>
        </BFormGroup>

        <BFormGroup>
          <template #label>
            <span class="rs-custom-input-label">Start time</span>
          </template>
          <DateTimePicker v-model="filterStart" :config="dateOptions" />
        </BFormGroup>

        <BFormGroup>
          <template #label>
            <span class="rs-custom-input-label">End time</span>
          </template>
          <DateTimePicker v-model="filterEnd" :config="dateOptions" />
        </BFormGroup>

        <template #modal-footer>
          <BButton variant="primary" @click="clearFilterOptions">
            Clear
          </BButton>
          <BButton variant="primary" @click="applyFilterOptions">
            Apply
          </BButton>
        </template>
      </BModal>

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
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import {
  BButton,
  BDropdownItem,
  BFormGroup,
  BFormInput,
  BFormSelect,
  BInputGroup,
  BLink,
  BModal,
  BPagination,
  BTab,
  BTable,
  BTabs,
  VBTooltip,
} from 'bootstrap-vue'

import { DateRangeTypes } from '@/constants/date'
import {
  isPlottableVolcanicEvent,
  createCSVContent,
  createFilenameFromEventDate,
} from '@/utils/bulletin'

import MoreMenu from '@/components/more-menu'
import ErrorMessage from '@/components/error-message'
import HypocenterViewer from '@/components/viewer/HypocenterViewer'
import DButtonIcon from '@/components/base/button-icon/DButtonIcon'
import { FilterListIcon, SaveAltIcon } from '@/components/icons/content'
import { RefreshIcon } from '@/components/icons/navigation'
import DateTimePicker from '@/components/base/datetime-picker'

import {
  NAMESPACE,
  eventTypesFilter,
  eventDateSortModeOptions,
} from '@/store/seismic/bulletin'
import rangeSelector, {
  maxCustomDuration,
} from '@/store/seismic/bulletin/range-selector'
import fieldOptions from '@/store/seismic/bulletin/field-options'
import labelOptions from '@/store/seismic/bulletin/label-options'
import {
  SET_END_TIME,
  SET_PERIOD,
  SET_START_TIME,
} from '@/store/base/mutations'
import { UPDATE_BULLETIN } from '@/store/seismic/bulletin/actions'
import { SET_EVENT_TYPE } from '@/store/seismic/bulletin/mutations'
import ClusterMediaImageViewer from './ClusterMediaImageViewer'
import ClusterMediaStream from './ClusterMediaStream'
import {
  SET_PAGE_SIZE,
  SET_PAGE,
  SET_TOTAL,
  UPDATE_FILTER_OPTIONS,
  RESET_FILTER_OPTIONS,
} from '../../store/seismic/bulletin/mutations'

export default {
  name: 'SeismicBulletin',
  components: {
    BButton,
    BDropdownItem,
    BFormGroup,
    BFormInput,
    BFormSelect,
    BInputGroup,
    BLink,
    BModal,
    BPagination,
    BTab,
    BTable,
    BTabs,
    ClusterMediaImageViewer,
    ClusterMediaStream,
    DateTimePicker,
    DButtonIcon,
    ErrorMessage,
    HypocenterViewer,
    MoreMenu,
  },
  directives: {
    'b-tooltip': VBTooltip,
  },
  data() {
    return {
      busy: false,
      event: {},
      eventTypesFilter,
      eventDateSortModeOptions,
      fieldOptions,
      filter: null,
      labelOptions,
      maxCustomDuration,
      pageOptions: [10, 25, 50, 100, 200],
      rangeSelector,
      tabIndex: 0,
      FilterListIcon,
      SaveAltIcon,
      RefreshIcon,
      isDownloading: false,
      isRefreshing: false,
      dateOptions: {
        format: 'YYYY-MM-DD HH:mm:ss',
        showClose: true,
        showClear: true,
      },
    }
  },
  computed: {
    ...mapState(NAMESPACE, {
      data: (state) => state.data,
      error: (state) => state.error,
      period: (state) => state.period,
      startTime: (state) => state.startTime,
      endTime: (state) => state.endTime,
    }),
    isPlottableEvent() {
      return isPlottableVolcanicEvent(this.event)
    },
    eventType: {
      get() {
        return this.$store.state.seismic.bulletin.eventType
      },
      set(value) {
        this.setEventType(value)
      },
    },
    currentPage: {
      get() {
        return this.$store.state.seismic.bulletin.page
      },
      set(value) {
        this.setPage(value)
      },
    },
    perPage: {
      get() {
        return this.$store.state.seismic.bulletin.pageSize
      },
      set(value) {
        this.setPageSize(value)
      },
    },
    totalRows: {
      get() {
        return this.$store.state.seismic.bulletin.total
      },
      set(value) {
        this.setTotal(value)
      },
    },
    filterStart: {
      get() {
        return this.$store.state.seismic.bulletin.filterOptions.start
      },
      set(value) {
        this.updateFilterOptions({ name: 'start', value: value })
      },
    },
    filterEnd: {
      get() {
        return this.$store.state.seismic.bulletin.filterOptions.end
      },
      set(value) {
        this.updateFilterOptions({ name: 'end', value: value })
      },
    },
    filterEventType: {
      get() {
        return this.$store.state.seismic.bulletin.filterOptions.eventType
      },
      set(value) {
        this.updateFilterOptions({ name: 'eventType', value: value })
      },
    },
    filterEventDateSortMode: {
      get() {
        return this.$store.state.seismic.bulletin.filterOptions
          .eventDateSortMode
      },
      set(value) {
        this.updateFilterOptions({ name: 'eventDateSortMode', value: value })
      },
    },
  },
  watch: {
    eventType(_value) {
      this.update()
    },
    currentPage(_value) {
      this.update()
    },
    perPage(_value) {
      this.update()
    },
  },
  async mounted() {
    this.update()
  },
  methods: {
    isPlottableVolcanicEvent,
    ...mapMutations({
      setPeriod(commit, period) {
        return commit(NAMESPACE + '/' + SET_PERIOD, period)
      },
      setStartTime(commit, value) {
        return commit(NAMESPACE + '/' + SET_START_TIME, value)
      },
      setEndTime(commit, value) {
        return commit(NAMESPACE + '/' + SET_END_TIME, value)
      },
      setEventType(commit, value) {
        return commit(NAMESPACE + '/' + SET_EVENT_TYPE, value)
      },
      setPage(commit, page) {
        return commit(NAMESPACE + '/' + SET_PAGE, page)
      },
      setPageSize(commit, size) {
        return commit(NAMESPACE + '/' + SET_PAGE_SIZE, size)
      },
      setTotal(commit, total) {
        return commit(NAMESPACE + '/' + SET_TOTAL, total)
      },
      updateFilterOptions(commit, options) {
        return commit(NAMESPACE + '/' + UPDATE_FILTER_OPTIONS, options)
      },
      resetFilterOptions(commit) {
        return commit(NAMESPACE + '/' + RESET_FILTER_OPTIONS)
      },
    }),
    ...mapActions({
      fetchData(dispatch) {
        return dispatch(NAMESPACE + '/' + UPDATE_BULLETIN)
      },
    }),
    async update() {
      this.busy = true
      this.fetchData().finally(() => {
        this.busy = false
      })
    },
    showDetails(item) {
      this.event = this.data.find((v) => v.eventid === item.eventid)
      this.$refs.dialog.show()
    },
    showFilterOptions() {
      this.$refs.filterOptions.show()
    },
    applyFilterOptions() {
      this.$refs.filterOptions.hide()
      this.update()
    },
    clearFilterOptions() {
      this.resetFilterOptions()
    },
    refreshTable() {
      this.isRefreshing = true
      this.busy = true
      this.fetchData().finally(() => {
        this.isRefreshing = false
        this.busy = false
      })
    },
    doDownload(blob, exportFilename) {
      if (navigator.msSaveBlob) {
        navigator.msSaveBlob(blob, exportFilename)
      } else {
        const link = document.createElement('a')
        if (link.download !== undefined) {
          const url = URL.createObjectURL(blob)
          link.setAttribute('href', url)
          link.setAttribute('download', exportFilename)
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
      }
    },
    downloadEventJSON(item) {
      const blob = new Blob([JSON.stringify(item)], {
        type: 'text/json;charset=utf-8;',
      })
      const exportFilename = createFilenameFromEventDate(item.eventdate, 'json')
      this.doDownload(blob, exportFilename)
    },
    downloadEventCSV(item) {
      const blob = new Blob([createCSVContent(item)], {
        type: 'text/csv;charset=utf-8;',
      })
      const exportFilename = createFilenameFromEventDate(item.eventdate)
      this.doDownload(blob, exportFilename)
    },
    downloadEventsCSV() {
      this.isDownloading = true

      const downloadTableAsync = (data) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            try {
              resolve(createCSVContent(data))
            } catch (e) {
              reject(e)
            }
          }, 300)
        })
      }

      downloadTableAsync(this.data)
        .then((content) => {
          const exportFilename = 'bulletin.csv'
          const blob = new Blob([content], {
            type: 'text/csv;charset=utf-8;',
          })
          this.doDownload(blob, exportFilename)
        })
        .catch((error) => {
          console.error(error)
        })
        .finally(() => {
          this.isDownloading = false
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
    onFiltered(filteredItems) {},
    onContextChanged(ctx) {},
  },
}
</script>

<style lang="scss" scoped>
.rs-custom-input-label {
  color: #24292e;
  font-size: 0.875rem;
  opacity: 0.75;
}

.bulletin-view {
  margin-bottom: 50px;
  padding: 10px;
}

.bulletin-table {
  display: flex;
  font-size: 0.85rem;
  left: 0;
  overflow-x: hidden;
  position: relative;
  right: 0;
}

.hypoview-container {
  position: relative;
  width: 100%;
  height: 400px;
}

.info-container {
  padding: 15px;
  max-height: 400px;
  overflow: auto;

  & ul {
    padding-left: 0;
  }

  & li {
    list-style: none;
  }
}

@media (min-width: 992px) {
  .bulletin-view {
    margin-left: 200px;
  }
}
</style>
