import Axios from 'axios'
import moment from 'moment'
import client from '@/utils/client'
import { DATETIME_FORMAT, DateRangeTypes } from '@/constants/date'
import { calculatePeriod } from '@/utils/datetime'

import { UPDATE_DATA, FETCH_DATA } from '../../store/base/actions'
import {
  SET_DATA,
  SET_ERROR,
  SET_LAST_UPDATED,
  SET_START_TIME,
  SET_END_TIME,
} from '../../store/base/mutations'
import { baseMutations } from '../../store/base'
import { cache, createEdmCacheKey, createSeismcitityCacheKey } from './cache'
import { toPlain } from './util'

export const EVENTS = [
  { value: 'VTA', text: 'Vulkanik Dalam', label: 'VTA' },
  { value: 'VTB', text: 'Vulkanik Dangkal', label: 'VTB' },
  { value: 'MP', text: 'Hybrid/Fase Banyak', label: 'MP' },
  { value: 'LF', text: 'Low Frekuensi', label: 'LF' },
  { value: 'ROCKFALL', text: 'Guguran', label: 'RF' },
  { value: 'GASBURST', text: 'Hembusan', label: 'DG' },
  { value: 'AWANPANAS', text: 'Awan Panas', label: 'AP' },
  { value: 'TREMOR', text: 'Tremor', label: 'TREMOR' },
  { value: 'TECT', text: 'Tektonik', label: 'TECT' },
  { value: 'EXPLOSION', text: 'Letusan', label: 'EXPL' },
]

export const EVENTS_MAP = EVENTS.reduce(
  (o, i) => ({ ...o, [i.value]: { text: i.text } }),
  {}
)

export const initialState = {
  isFetching: false,
  cancelToken: null,
  data: [],
  error: null,
  title: '',
  backgroundColor: '#fff',
  width: 600,
  height: 500,
  edmNameGap: 60,
  seismicityNameGap: 30,
  colormap: '',
  benchmark: 'BAB0',
  reflector: 'RB2',
  sampling: 'day',
  edmYLabel: 'EDM (meter)',
  seismicityYLabel: 'Jumlah Gempa',
  selectedEvents: EVENTS.map((v) => v.value),
  events: [...EVENTS],
  period: null,
  startTime: null,
  endTime: null,
  periods: [
    {
      count: 7,
      type: 'day',
      text: '7 days',
    },
    {
      count: 10,
      type: 'day',
      text: '10 days',
    },
    {
      count: 1,
      type: 'month',
      text: '1 month',
    },
    {
      count: 2,
      type: 'month',
      text: '2 months',
    },
    {
      count: 3,
      type: 'month',
      text: '3 months',
    },
  ],
  theme: 'default',
  themes: [
    { value: 'default', text: 'Default' },
    { value: 'chalk', text: 'Chalk' },
    { value: 'dark', text: 'Dark' },
    { value: 'essos', text: 'Essos' },
    { value: 'infographic', text: 'Infographic' },
    { value: 'macarons', text: 'Macarons' },
    { value: 'purple-passion', text: 'Purple Passion' },
    { value: 'roma', text: 'Roma' },
    { value: 'shine', text: 'Shine' },
    { value: 'tab20', text: 'Tab20' },
    { value: 'vintage', text: 'Vintage' },
    { value: 'walden', text: 'Walden' },
    { value: 'westeros', text: 'Wasteros' },
    { value: 'wonderland', text: 'Wonderland' },
  ],
  marginLeft: 15,
  marginRight: 5,
  marginTop: 15,
  marginBottom: 5,
}

export const initState = (period) => {
  const { startTime, endTime } = calculatePeriod(period)
  return {
    ...initialState,
    period,
    startTime,
    endTime,
  }
}

export const getters = {
  edmData(state) {
    const data = state.data
    if (Array.isArray(data) && data.length) {
      return data[0]
    }
    return []
  },

  seismicityData(state) {
    const data = state.data
    if (Array.isArray(data) && data.length > 1) {
      return data.slice(1, data.length)
    }
    return []
  },
}

// Mutation types.
export const SET_BENCHMARK = 'setBenchmark'
export const SET_REFLECTOR = 'setReflector'
export const SET_WIDTH = 'setWidth'
export const SET_HEIGHT = 'setHeight'
export const SET_SELECTED_EVENTS = 'setSelectedEvents'
export const SET_EDM_NAME_GAP = 'setEdmNameGap'
export const SET_SEISMICITY_NAME_GAP = 'setSeismicityNameGap'
export const SET_THEME = 'setTheme'
export const SET_MARGIN_LEFT = 'setMarginLeft'
export const SET_MARGIN_RIGHT = 'setMarginRight'
export const SET_MARGIN_TOP = 'setMarginTop'
export const SET_MARGIN_BOTTOM = 'setMarginBottom'
export const SET_EDM_YLABEL = 'setEdmYLabel'
export const SET_SEISMICITY_YLABEL = 'setSeismicityYLabel'

export const mutations = {
  ...baseMutations,
  [SET_BENCHMARK](state, value) {
    state.benchmark = value
  },
  [SET_REFLECTOR](state, value) {
    state.reflector = value
  },
  [SET_WIDTH](state, value) {
    state.width = value
  },
  [SET_HEIGHT](state, value) {
    state.height = value
  },
  [SET_EDM_NAME_GAP](state, value) {
    state.edmNameGap = value
  },
  [SET_SEISMICITY_NAME_GAP](state, value) {
    state.seismicityNameGap = value
  },
  [SET_THEME](state, value) {
    state.theme = value
  },
  [SET_SELECTED_EVENTS](state, value) {
    state.selectedEvents = value
  },
  [SET_MARGIN_LEFT](state, value) {
    state.marginLeft = value
  },
  [SET_MARGIN_RIGHT](state, value) {
    state.marginRight = value
  },
  [SET_MARGIN_TOP](state, value) {
    state.marginTop = value
  },
  [SET_MARGIN_BOTTOM](state, value) {
    state.marginBottom = value
  },
  [SET_EDM_YLABEL](state, value) {
    state.edmYLabel = value
  },
  [SET_SEISMICITY_YLABEL](state, value) {
    state.seismicityYLabel = value
  },
}

export const actions = {
  async [FETCH_DATA]({ commit, state }) {
    state.isFetching = true

    if (state.error) {
      commit(SET_ERROR, null)
    }

    const requests = []
    let seismicityCacheKey = ''
    let edmCacheKey = ''

    edmCacheKey = createEdmCacheKey(
      state.benchmark,
      state.reflector,
      state.startTime,
      state.endTime
    )
    if (cache.has(edmCacheKey)) {
      requests.push(Promise.resolve(cache.get(edmCacheKey)))
    } else {
      requests.push(
        client.get('/edm/', {
          params: {
            start_at: state.startTime.format(DATETIME_FORMAT),
            end_at: state.endTime.format(DATETIME_FORMAT),
            ci: true,
            benchmark: state.benchmark,
            reflector: state.reflector,
            ordering: 'timestamp',
            compact: true,
            rate: true,
          },
        })
      )
    }

    state.selectedEvents.forEach((code) => {
      seismicityCacheKey = createSeismcitityCacheKey(
        code,
        state.startTime,
        state.endTime
      )
      if (cache.has(seismicityCacheKey)) {
        requests.push(Promise.resolve(cache.get(seismicityCacheKey)))
      } else {
        requests.push(
          client.get('/seismicity/', {
            params: {
              count_per: state.sampling,
              end: state.endTime.format(DATETIME_FORMAT),
              eventdate__gte: state.startTime.format(DATETIME_FORMAT),
              eventdate__lt: state.endTime.format(DATETIME_FORMAT),
              eventtype: code,
              nolimit: true,
              reindex: true,
              start: state.startTime.format(DATETIME_FORMAT),
            },
          })
        )
      }
    })

    const data = await Promise.all(requests)
      .then((responses) => {
        return responses.map((response) => {
          if (response.config != null) {
            return response.data
          } else {
            return response
          }
        })
      })
      .catch((error) => {
        commit(SET_ERROR, error)
        return []
      })

    if (Array.isArray(data) && data.length) {
      const edmData = toPlain(data[0])
      cache.set(edmCacheKey, edmData)

      const seismicityData = data.slice(1, data.length)
      state.selectedEvents.forEach((code, index) => {
        seismicityCacheKey = createSeismcitityCacheKey(
          code,
          state.startTime,
          state.endTime
        )
        cache.set(seismicityCacheKey, toPlain(seismicityData[index]))
      })
    }

    commit(SET_DATA, data)
    commit(SET_LAST_UPDATED, moment())
    state.isFetching = false
  },

  async [UPDATE_DATA](
    { dispatch, commit, state },
    { dirty = true, updatePeriod = false } = {}
  ) {
    if (dirty) {
      if (state.period.type === DateRangeTypes.CUSTOM) {
        return dispatch(FETCH_DATA)
      } else {
        if (updatePeriod) {
          const { startTime, endTime } = calculatePeriod(state.period)
          commit(SET_START_TIME, startTime)
          commit(SET_END_TIME, endTime)
        }
        return dispatch(FETCH_DATA)
      }
    }
  },
}

const defaultPeriod = initialState.periods[0]

export default {
  namespaced: true,
  state: initState(defaultPeriod),
  getters,
  mutations,
  actions,
}
