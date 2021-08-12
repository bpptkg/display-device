import moment from 'moment'
import { isString, isNumber } from 'lodash'
import { isObject } from '@/utils/common'

export default {
  props: {
    end: {
      type: [Object, String],
      default: null,
    },
    endLabel: {
      type: String,
      default: 'End time',
    },
    start: {
      type: [Object, String],
      default: null,
    },
    startLabel: {
      type: String,
      default: 'Start time',
    },
    title: {
      type: String,
      default: 'Period',
    },
    noTitle: {
      type: Boolean,
      default: false,
    },
    dateFormat: {
      type: String,
      default: 'MMM, DD YYYY HH:mm:ss [WIB]',
    },
    durationLabel: {
      type: String,
      default: 'Duration',
    },
    exactDuration: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    duration() {
      if (this.startTime && this.endTime) {
        const duration = moment.duration(this.endTime.diff(this.startTime))
        const exactDays = duration.asDays()
        return this.exactDuration
          ? `${exactDays.toFixed(2)} days`
          : duration.humanize()
      } else {
        return ''
      }
    },
    startTime() {
      return this.getOrParseDate(this.start)
    },
    endTime() {
      return this.getOrParseDate(this.end)
    },
    startFormatted() {
      return this.startTime ? this.startTime.format(this.dateFormat) : ''
    },
    endFormatted() {
      return this.endTime ? this.endTime.format(this.dateFormat) : ''
    },
  },
  methods: {
    getOrParseDate(value) {
      if (isObject(value)) {
        return value
      } else if (isString(value) || isNumber(value)) {
        return moment(value)
      } else {
        return null
      }
    },
  },
}
