import moment from 'moment'
import { formatDate } from '@/utils/datetime'

export default {
  methods: {
    timeFormatted(time) {
      return moment(time).fromNow()
    },
    tooltipTitle(time) {
      return formatDate(time)
    },
  },
}
