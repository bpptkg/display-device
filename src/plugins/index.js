import moment from 'moment'
import { capitalize } from '@/utils/common'

export default {
  install(Vue, options) {
    Vue.filter('dateFormat', (value, format) => {
      if (!value) return ''
      return moment(value).format(format)
    })

    Vue.filter('toFixed', (value, fractionDigits) => {
      if (!value || typeof value !== 'number') return ''
      return value.toFixed(fractionDigits)
    })

    Vue.filter('capitalize', (string) => {
      if (!string) return ''
      return capitalize(string)
    })
  },
}
