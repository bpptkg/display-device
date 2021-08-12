<template>
  <div class="bulletin-view">
    <h5>Seismic Bulletin</h5>

    <div class="d-flex">
      <RangeSelector
        ref="range-selector"
        size="sm"
        class="mb-4"
        custom-enabled
        :selected="period"
        :items="rangeSelector"
        :max-custom-duration="maxCustomDuration"
        @period-selected="onPeriodChange"
      />

      <BButtonGroup class="ml-2">
        <DButtonIcon
          v-b-tooltip.hover
          :busy="isRefreshing"
          :icon="RefreshIcon"
          no-border
          no-shadow
          title="Refresh Table"
          @click.native="refreshTable"
        />
        <DButtonIcon
          v-b-tooltip.hover
          :busy="isDownloading"
          :icon="SaveAltIcon"
          no-border
          no-shadow
          title="Download Table"
          @click.native="downloadEventsCSV"
        />
      </BButtonGroup>
    </div>

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
          <BFormGroup label="Show">
            <BFormSelect
              v-model="perPage"
              size="sm"
              :options="pageOptions"
            ></BFormSelect>
          </BFormGroup>

          <BFormGroup label="Event type" class="ml-2">
            <BFormSelect
              v-model="eventType"
              size="sm"
              :options="eventTypesFilter"
            ></BFormSelect>
          </BFormGroup>
        </div>

        <BFormGroup label="Filter">
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
          :current-page="currentPage"
          :per-page="perPage"
          :filter="filter"
          @filtered="onFiltered"
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
  BButtonGroup,
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
import RangeSelector from '@/components/range-selector'
import HypocenterViewer from '@/components/viewer/HypocenterViewer'
import DButtonIcon from '@/components/base/button-icon/DButtonIcon'
import { SaveAltIcon } from '@/components/icons/content'
import { RefreshIcon } from '@/components/icons/navigation'

import { NAMESPACE, eventTypesFilter } from '@/store/seismic/bulletin'
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

export default {
  name: 'SeismicBulletin',
  components: {
    BButtonGroup,
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
    DButtonIcon,
    ErrorMessage,
    HypocenterViewer,
    MoreMenu,
    RangeSelector,
  },
  directives: {
    'b-tooltip': VBTooltip,
  },
  data() {
    return {
      busy: false,
      currentPage: 1,
      event: {},
      eventTypesFilter,
      fieldOptions,
      filter: null,
      labelOptions,
      maxCustomDuration,
      pageOptions: [10, 25, 50, 100, 200],
      perPage: 10,
      rangeSelector,
      tabIndex: 0,
      totalRows: 1,
      SaveAltIcon,
      RefreshIcon,
      isDownloading: false,
      isRefreshing: false,
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
  },
  watch: {
    eventType(value) {
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
    }),
    ...mapActions({
      fetchData(dispatch) {
        return dispatch(NAMESPACE + '/' + UPDATE_BULLETIN)
      },
    }),
    async update() {
      this.busy = true
      this.fetchData().finally(() => {
        this.totalRows = this.data.length
        this.busy = false
      })
    },
    showDetails(item) {
      this.event = this.data.find((v) => v.eventid === item.eventid)
      this.$refs.dialog.show()
    },
    refreshTable() {
      this.isRefreshing = true
      this.busy = true
      this.fetchData().finally(() => {
        this.totalRows = this.data.length
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
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
  },
}
</script>

<style lang="scss" scoped>
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
