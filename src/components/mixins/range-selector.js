import { onPeriodChange } from './common'

export default {
  methods: {
    /**
     * Handle period-selected event from RangeSelector component.
     *
     * Required methods are setPeriod(), setStartTime(), setEndTime(). These
     * methods are primary mapped from Vuex store.
     *
     * It will also call update() method to fetch newest data from APIs and
     * redraw chart. So, you have to implement update() method in your
     * component.
     */
    onPeriodChange,
  },
}
