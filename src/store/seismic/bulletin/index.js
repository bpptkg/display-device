import moment from 'moment'
import { get } from 'lodash'
import client from '@/utils/client'
import { DateRangeTypes } from '@/constants/date'
import { calculatePeriod } from '@/utils/datetime'

import {
  SET_DATA,
  SET_END_TIME,
  SET_ERROR,
  SET_LAST_UPDATED,
  SET_START_TIME,
} from '../../base/mutations'
import { baseState, baseMutations } from '../../base'
import { FETCH_BULLETIN, UPDATE_BULLETIN } from './actions'
import {
  RESET_EVENT_TYPE,
  RESET_FILTER_OPTIONS,
  SET_CLUSTER_DICT,
  SET_EVENT_TYPE,
  SET_FILTER_OPTIONS,
  SET_LINK,
  SET_PAGE_SIZE,
  SET_PAGE,
  SET_PAGES,
  SET_TOTAL,
  UPDATE_FILTER_OPTIONS,
} from './mutations'
import rangeSelector from './range-selector'
import { seismicEvents } from '@/constants/bulletin'

export const NAMESPACE = 'seismic/bulletin'

export const eventTypesFilter = [
  { code: 'ALL', value: 'ALL', text: 'ALL' },
  ...seismicEvents.map((v) => ({
    code: v.code,
    value: v.code,
    text: v.code,
  })),
]

export const eventDateSortModeOptions = [
  { value: 'asc', text: 'Ascending' },
  { value: 'desc', text: 'Descending' },
]

export const defaultFilterOptions = {
  eventType: 'ALL',
  start: '',
  end: '',
  // Sort eventdate field by ascending (asc) or descending (desc).
  eventDateSortMode: 'desc',
}

export const initialState = {
  ...baseState,
  clusterDict: {},
  eventType: 'ALL', // Deprecated. Use filterOptions instead.
  page: 1,
  pages: 0,
  total: 0,
  pageSize: 10,
  hasNext: false,
  hasPrevious: false,
  nexLink: '',
  previousLink: '',
  filterOptions: {
    ...defaultFilterOptions,
  },
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

export const state = () => {
  return { ...initialState }
}

export const getters = {}

export const mutations = {
  ...baseMutations,
  [SET_CLUSTER_DICT](state, value) {
    state.clusterDict = value
  },
  [SET_EVENT_TYPE](state, value) {
    state.eventType = value
  },
  [RESET_EVENT_TYPE](state) {
    state.eventType = 'ALL'
  },
  [SET_PAGE](state, page) {
    state.page = page
  },
  [SET_PAGE_SIZE](state, size) {
    state.pageSize = size
  },
  [SET_LINK](state, links) {
    const { next, previous } = links
    state.nexLink = next
    state.previousLink = previous
    state.hasNext = next !== null
    state.hasPrevious = previous !== null
  },
  [SET_PAGES](state, pages) {
    state.pages = pages
  },
  [SET_TOTAL](state, total) {
    state.total = total
  },
  [SET_FILTER_OPTIONS](state, options) {
    state.filterOptions = options
  },
  [UPDATE_FILTER_OPTIONS](state, { name, value }) {
    if (name in state.filterOptions) {
      state.filterOptions[name] = value
    }
  },
  [RESET_FILTER_OPTIONS](state) {
    state.filterOptions = { ...defaultFilterOptions }
  },
}

export const actions = {
  async [FETCH_BULLETIN]({ commit, state }) {
    if (state.error) {
      commit(SET_ERROR, null)
    }

    // Because bulletin API doesn't has clusterEvent included, we need to fetch
    // cluster dictionary to calculate clusterEvent.
    const clusterDictRequest = client.get('/cluster/dict/')

    // Fetch for selected fields to speed up query.
    const fields = [
      'eventid',
      'eventdate',
      'eventdate_microsecond',
      'duration',
      'amplitude',
      'magnitude',
      'longitude',
      'latitude',
      'depth',
      'eventtype',
      'seiscompid',
      'validated',
      'projection',
      'operator',
      'last_modified',
      'ml_deles',
      'ml_labuhan',
      'ml_pasarbubar',
      'ml_pusunglondon',
      'location_type',
      'location_mode',
      'cluster',
      'corr_coef',
      'btbb',
    ]

    const params = {
      page: state.page,
      page_size: state.pageSize,
      eventtype__isnull: false,
      fields: fields.join(','),
    }

    // Apply filter options.
    if (
      state.filterOptions.eventType &&
      state.filterOptions.eventType !== 'ALL'
    ) {
      params.eventtype = state.filterOptions.eventType
    }
    if (state.filterOptions.start) {
      params.eventdate__gte = state.filterOptions.start
    }
    if (state.filterOptions.end) {
      params.eventdate__lt = state.filterOptions.end
    }
    if (state.filterOptions.eventDateSortMode === 'desc') {
      params.ordering = '-eventdate'
    } else {
      params.ordering = 'eventdate'
    }

    const bulletinRequest = client.get('/bulletin/', {
      params,
    })

    await Promise.all([bulletinRequest, clusterDictRequest])
      .then((responses) => {
        const clusterDict = responses[1].data.reduce((acc, cur) => {
          acc[cur.cluster] = cur.eventtype
          return acc
        }, {})

        const results = responses[0].data.results || []
        const data = results.map((v) => {
          return {
            ...v,
            clusterEvent: get(clusterDict, v.cluster, 'UNCLUSTERED'),
          }
        })

        const rawData = responses[0].data
        const { links, pages, total } = rawData
        commit(SET_PAGES, pages)
        commit(SET_LINK, links)
        commit(SET_TOTAL, total)

        commit(SET_CLUSTER_DICT, clusterDict)
        commit(SET_DATA, data)
        commit(SET_LAST_UPDATED, moment())
      })
      .catch((error) => {
        commit(SET_ERROR, error)
        commit(SET_LAST_UPDATED, moment())
      })
  },

  async [UPDATE_BULLETIN]({ dispatch, commit, state }) {
    if (state.period.type === DateRangeTypes.CUSTOM) {
      return dispatch(FETCH_BULLETIN)
    } else {
      const { startTime, endTime } = calculatePeriod(state.period)
      commit(SET_START_TIME, startTime)
      commit(SET_END_TIME, endTime)
      return dispatch(FETCH_BULLETIN)
    }
  },
}

const defaultPeriod = rangeSelector[0]

export default {
  namespaced: true,
  state: initState(defaultPeriod),
  getters,
  mutations,
  actions,
}
