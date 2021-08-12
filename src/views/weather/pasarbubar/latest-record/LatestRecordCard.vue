<template>
  <div>
    <div v-if="error">
      <BCard>
        <ErrorMessage>
          <p>Unable to load data.</p>
          <p>Error: {{ error.message }}</p>
          <p>
            <BLink @click="update"> Try again </BLink>
          </p>
        </ErrorMessage>
      </BCard>
    </div>
    <div v-else>
      <BOverlay :show="isLoading">
        <BCard no-body>
          <div class="ml-3 mt-3">
            <div>
              <h5>Latest Record</h5>
            </div>
            <div class="mt-2">
              {{ day }}
            </div>
            <div>{{ date }}</div>
          </div>
          <BListGroup flush class="mt-4">
            <BListGroupItem v-for="(list, i) in itemList" :key="i">
              <BRow>
                <BCol v-for="item in list" :key="item.id" sm="6">
                  <LatestRecordItem :item="item" />
                </BCol>
              </BRow>
            </BListGroupItem>
          </BListGroup>
        </BCard>
        <DNote class="mt-2">
          Last updated: {{ lastUpdatedTimestamp }} &middot;
          <BLink @click="update"> Update </BLink>
        </DNote>
      </BOverlay>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { mapActions, mapState } from 'vuex'
import { mapOrEmpty } from '@/utils/series'
import {
  BCard,
  BCol,
  BLink,
  BListGroup,
  BListGroupItem,
  BOverlay,
  BRow,
  VBTooltip,
} from 'bootstrap-vue'
import {
  BatteryIcon,
  HumidityIcon,
  PressureIcon,
  TemperatureIcon,
  WindDirectionIcon,
  WindSpeedIcon,
} from '@/components/icons/weather'
import DNote from '@/components/base/note/DNote'
import ErrorMessage from '@/components/error-message'
import { FETCH_LATEST_RECORD } from '@/store/weather/pasarbubar/latest-record/actions'
import LatestRecordItem from './LatestRecordItem'

const NAMESPACE = 'weather/pasarbubar/latestRecord'

export default {
  name: 'CardLatestRecord',
  components: {
    BCard,
    BCol,
    BLink,
    BListGroup,
    BListGroupItem,
    BOverlay,
    BRow,
    DNote,
    ErrorMessage,
    LatestRecordItem,
  },
  directives: {
    'b-tooltip': VBTooltip,
  },
  data() {
    return {
      isLoading: false,
      interval: null,
      updateInterval: 60000,
    }
  },
  computed: {
    ...mapState(NAMESPACE, {
      data: (state) => state.data,
      error: (state) => state.error,
      lastUpdated: (state) => state.lastUpdated,
    }),
    items() {
      return [
        {
          id: 'wind_direction',
          icon: {
            icon: WindDirectionIcon,
            color: '#37a2da',
          },
          value: mapOrEmpty(this.data, 'wind_direction'),
          valueSuffix: '\u00B0',
          label: 'Wind direction',
        },
        {
          id: 'wind_speed',
          icon: {
            icon: WindSpeedIcon,
            color: '#32c5e9',
          },
          value: mapOrEmpty(this.data, 'wind_speed'),
          valueSuffix: ' km/h',
          label: 'Wind speed',
        },
        {
          id: 'air_temperature',
          icon: {
            icon: TemperatureIcon,
            color: '#ffdb5c',
          },
          value: mapOrEmpty(this.data, 'air_temperature'),
          valueSuffix: '\u00B0C',
          label: 'Air temperature',
        },
        {
          id: 'air_humidity',
          icon: {
            icon: HumidityIcon,
            color: '#fb7293',
          },
          value: mapOrEmpty(this.data, 'air_humidity'),
          valueSuffix: '%',
          label: 'Air humidity',
        },
        {
          id: 'air_pressure',
          icon: {
            icon: PressureIcon,
            color: '#e062ae',
          },
          value: mapOrEmpty(this.data, 'air_pressure'),
          valueSuffix: ' kPa',
          label: 'Air pressure',
        },
        {
          id: 'battery_voltage',
          icon: {
            icon: BatteryIcon,
            color: '#8378ea',
          },
          value: mapOrEmpty(this.data, 'battery_voltage'),
          valueSuffix: ' V',
          label: 'Battery voltage',
        },
      ]
    },
    itemList() {
      const list = this.items.reduce((acc, n, i) => {
        i % 2 ? acc[acc.length - 1].push(n) : acc.push([n])
        return acc
      }, [])
      return list
    },
    day() {
      const timestamp = this.data.timestamp
      return timestamp ? moment(timestamp).format('dddd') : ''
    },
    date() {
      const timestamp = this.data.timestamp
      return timestamp
        ? moment(timestamp).format('MMM D, YYYY HH:mm:ss [WIB]')
        : ''
    },
    lastUpdatedTimestamp() {
      return this.lastUpdated !== null
        ? this.lastUpdated.format('YYYY-MM-DD HH:mm:ss')
        : ''
    },
  },
  mounted() {
    this.interval = setInterval(() => {
      this.update()
    }, this.updateInterval)
    this.update()
  },
  beforeDestroy() {
    clearInterval(this.interval)
  },
  methods: {
    ...mapActions({
      fetchLatestRecord(dispatch) {
        return dispatch(NAMESPACE + '/' + FETCH_LATEST_RECORD)
      },
    }),
    update() {
      this.isLoading = true
      this.fetchLatestRecord().finally(() => {
        this.isLoading = false
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
