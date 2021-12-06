import moment from 'moment'
import client from '@/utils/client'
import {
  SET_SETTLED,
  SET_IMAGE,
  SET_ERROR,
  SET_CODE,
  SET_OPTIONS,
} from './mutations'
import { UPDATE_IMAGE } from './actions'
import { SET_LAST_UPDATED } from '../base/mutations'

export const HelicorderChannel = Object.freeze({
  PASB_BHZ_MP_10: 'PASB_BHZ_MP_10',
  DELS_SHZ_MP_01: 'DELS_SHZ_MP_01',
})

export const initialState = {
  /**
   * Image src in base64 string.
   */
  src: '',
  /**
   * If the first image is successfully fetched, the value will be true
   * subsequently.
   */
  settled: false,
  /**
   * Error message if fetching failed.
   */
  error: null,
  /**
   * Query options.
   */
  options: {
    lb: 1,
  },
  /**
   * Channel name (code).
   */
  code: HelicorderChannel.PASB_BHZ_MP_10,
  /**
   * Last updated timestamp.
   */
  lastUpdated: moment(),
}

export const initState = () => {
  return {
    ...initialState,
  }
}

export const getters = {}

export const mutations = {
  [SET_SETTLED](state, value) {
    state.settled = value
  },
  [SET_IMAGE](state, src) {
    state.src = src
  },
  [SET_ERROR](state, error) {
    state.error = error
  },
  [SET_LAST_UPDATED](state, lastUpdated) {
    state.lastUpdated = lastUpdated
  },
  [SET_CODE](state, code) {
    state.code = code
  },
  [SET_OPTIONS](state, options) {
    state.options = { ...state.options, ...options }
  },
}

export const actions = {
  async [UPDATE_IMAGE]({ commit, state }) {
    if (state.error) {
      commit(SET_ERROR, null)
    }

    client
      .get('/winston/helicorder/', {
        responseType: 'arraybuffer',
        params: {
          code: state.code,
          ...state.options,
        },
      })
      .then((response) => {
        const data = Buffer.from(response.data, 'binary').toString('base64')
        const imageSrc = `data:image/png;base64,${data}`
        commit(SET_IMAGE, imageSrc)

        // Set settled once the image has been successfully fetched.
        if (!state.settled) {
          commit(SET_SETTLED, true)
        }
      })
      .catch((error) => {
        commit(SET_ERROR, error)
      })
      .finally(() => {
        commit(SET_LAST_UPDATED, moment())
      })
  },
}

export const initModule = () => {
  return {
    namespaced: true,
    state: initState(),
    getters,
    mutations,
    actions,
  }
}

export default {
  namespaced: true,
  modules: {
    namespaced: true,
    [HelicorderChannel.PASB_BHZ_MP_10]: initModule(),
    [HelicorderChannel.DELS_SHZ_MP_01]: initModule(),
  },
}
