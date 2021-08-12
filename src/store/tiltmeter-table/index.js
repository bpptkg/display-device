import client from '@/utils/client'
import { DataTypes } from '@/constants/tiltmeter'
import {
  SET_DATA,
  SET_PAGE_SIZE,
  SET_ORDERING,
  SET_STATION,
  SET_ERROR,
  SET_CURRENT_PAGE,
} from './mutations'
import {
  FETCH_TILTMETER,
  FETCH_NEXT_PAGE,
  FETCH_PREVIOUS_PAGE,
} from './actions'
import {
  stationOptions,
  pageSizeOptions,
  orderingOptions,
  fields,
} from './constants'

const initialState = {
  station: 'platform/grawah',
  pageSize: 10,
  currentPage: 1,
  ordering: '-timestamp',
  data: null,
  error: null,
  stationOptions,
  pageSizeOptions,
  orderingOptions,
  fields,
}

export const state = () => {
  return { ...initialState }
}

export const getters = {
  type(state) {
    return state.station.split('/')[0]
  },
  stationName(state) {
    return state.station.split('/')[1]
  },
  series(state) {
    if (!state.data) return []
    return state.data.results
  },
  hasNext(state) {
    if (!state.data) return false
    return state.data.links.next && state.data.links.next !== null
  },
  hasPrevious(state) {
    if (!state.data) return false
    return state.data.links.previous && state.data.links.previous !== null
  },
  totalPage(state) {
    if (!state.data) return 0
    return state.data.total
  },
}

export const mutations = {
  [SET_DATA](state, data) {
    state.data = data
  },
  [SET_PAGE_SIZE](state, pageSize) {
    state.pageSize = pageSize
  },
  [SET_ORDERING](state, ordering) {
    state.ordering = ordering
  },
  [SET_STATION](state, station) {
    state.station = station
  },
  [SET_CURRENT_PAGE](state, value) {
    state.currentPage = value
  },
  [SET_ERROR](state, error) {
    state.error = error
  },
}

export const actions = {
  async [FETCH_TILTMETER]({ commit, getters, state }) {
    if (state.error) {
      commit(SET_ERROR, null)
    }

    let url = ''
    switch (getters.type) {
      case DataTypes.PLATFORM:
        url = `/tiltmeter/${getters.stationName}/`
        break
      case DataTypes.PLATFORM_RAW:
        url = `/tiltmeter/raw/${getters.stationName}/`
        break
      case DataTypes.BOREHOLE:
        url = `/tiltborehole/${getters.stationName}/`
        break
      case DataTypes.TLR:
        url = `/tiltmeter/tlr/${getters.stationName}/`
        break
      default:
        url = `/tiltmeter/${getters.stationName}/`
    }

    const data = await client
      .get(url, {
        params: {
          page_size: state.pageSize,
          ordering: state.ordering,
          page: state.currentPage,
        },
      })
      .then((response) => response.data)
      .catch((error) => {
        commit(SET_ERROR, error)
        return []
      })
    commit(SET_DATA, data)
  },
  async [FETCH_NEXT_PAGE]({ dispatch, commit, state, getters }) {
    if (getters.hasNext) {
      commit(SET_CURRENT_PAGE, state.currentPage + 1)
      return dispatch(FETCH_TILTMETER)
    }
  },
  async [FETCH_PREVIOUS_PAGE]({ dispatch, commit, state, getters }) {
    if (getters.hasPrevious) {
      commit(SET_CURRENT_PAGE, state.currentPage - 1)
      return dispatch(FETCH_TILTMETER)
    }
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
