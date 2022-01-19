import moment from 'moment'
import { BaseApiKeyClient as client } from '@/utils/client'
import Cache from '@/utils/cache'
import { SET_ERROR, SET_LAST_UPDATED, SET_PERIOD } from '../../base/mutations'
import { UPDATE_IMAGE } from './actions'
import { SET_GRAPH, SET_IMAGE, SET_IS_LOADING, SET_OFFSET } from './mutations'
import rangeSelector from './range-selector'

export const defaultPeriod = rangeSelector[0]

const cache = new Cache()

/**
 * GPS graphs file name prefix.
 *
 * Full file name can be appended by duration. For example, 10 days GPS baseline
 * file name would be `BASELINES_10d.png`. You can also refer to the WebObs for
 * list of all available file names.
 */
export const GPSGraphs = Object.freeze({
  baseline: 'BASELINES',
  modeling: 'MODELLING',
  modeltime: 'MODELTIME',
  motion: 'MOTION',
  vector: 'VECTORS',
  babadan: 'pdcbab0',
  bpptkg: 'pdcbptk',
  deles: 'pdcdel0',
  grawah: 'pdcjgr0',
  jrakah: 'pdcjra0',
  klatakan: 'pdckla0',
  kendit: 'pdckndt',
  labuhan: 'pdclabh',
  pasarbubar: 'pdcpas0',
  plawangan: 'pdcpla0',
  selo: 'pdcsel0',
})

export const buildFilename = (name, duration) => {
  return `${name}_${duration}.png`
}

export const initialState = {
  /**
   * Image src in base64 string.
   */
  src: '',
  /**
   * GPS graph type.
   */
  graph: '',
  /**
   * True if the app is fetching the image. Otherwise, false.
   */
  isLoading: false,
  /**
   * Error message if fetching failed.
   */
  error: null,
  /**
   * Time offset in moment object. Default to now. Note that BMA only support
   * update date parts. Time parts will be discarded.
   */
  offset: moment(),
  /**
   * Last updated timestamp.
   */
  lastUpdated: moment(),
  /**
   * Period info.
   */
  period: defaultPeriod,
}

export const initState = ({ period = defaultPeriod, graph = '' } = {}) => {
  return {
    ...initialState,
    period,
    graph,
  }
}

export const getters = {}

export const mutations = {
  [SET_IMAGE](state, src) {
    state.src = src
  },
  [SET_GRAPH](state, graph) {
    state.graph = graph
  },
  [SET_ERROR](state, error) {
    state.error = error
  },
  [SET_LAST_UPDATED](state, lastUpdated) {
    state.lastUpdated = lastUpdated
  },
  [SET_PERIOD](state, period) {
    state.period = period
  },
  [SET_OFFSET](state, offset) {
    state.offset = offset
  },
  [SET_IS_LOADING](state, value) {
    state.isLoading = value
  },
}

export const buildImageBaseUrl = (offset, graph, period) => {
  const date = offset.format('YYYY/MM/DD')
  return `${date}/${buildFilename(graph, period.suffix)}`
}

export const actions = {
  async [UPDATE_IMAGE]({ commit, state }) {
    if (state.error) {
      commit(SET_ERROR, null)
    }

    commit(SET_IS_LOADING, true)

    const imageUrl = `/gps/${buildImageBaseUrl(
      state.offset,
      state.graph,
      state.period
    )}`

    if (cache.hasData(imageUrl)) {
      const cacheImage = cache.get(imageUrl)
      commit(SET_IMAGE, cacheImage)
      commit(SET_IS_LOADING, false)
      commit(SET_LAST_UPDATED, moment())
    } else {
      client
        .get(imageUrl, {
          responseType: 'arraybuffer',
        })
        .then((response) => {
          const data = Buffer.from(response.data, 'binary').toString('base64')
          const imageSrc = `data:image/png;base64,${data}`
          commit(SET_IMAGE, imageSrc)

          // Cache image in the local cache.
          cache.set(imageUrl, imageSrc)
        })
        .catch((error) => {
          commit(SET_ERROR, error)
        })
        .finally(() => {
          commit(SET_IS_LOADING, false)
          commit(SET_LAST_UPDATED, moment())
        })
    }
  },
}

const initModule = (args = {}) => {
  return {
    namespaced: true,
    state: initState(args),
    getters,
    mutations,
    actions,
  }
}

export default {
  namespaced: true,
  modules: {
    summary: {
      namespaced: true,
      modules: {
        namespaced: true,
        baseline: initModule({ graph: GPSGraphs.baseline }),
        modeling: initModule({ graph: GPSGraphs.modeling }),
        modeltime: initModule({ graph: GPSGraphs.modeltime }),
      },
    },
    baseline: initModule({ graph: GPSGraphs.baseline }),
    modeling: initModule({ graph: GPSGraphs.modeling }),
    modeltime: initModule({ graph: GPSGraphs.modeltime }),
    motion: initModule({ graph: GPSGraphs.motion }),
    vector: initModule({ graph: GPSGraphs.vector }),
    babadan: initModule({ graph: GPSGraphs.babadan }),
    bpptkg: initModule({ graph: GPSGraphs.bpptkg }),
    deles: initModule({ graph: GPSGraphs.deles }),
    jrakah: initModule({ graph: GPSGraphs.jrakah }),
    grawah: initModule({ graph: GPSGraphs.grawah }),
    klatakan: initModule({ graph: GPSGraphs.klatakan }),
    kendit: initModule({ graph: GPSGraphs.kendit }),
    labuhan: initModule({ graph: GPSGraphs.labuhan }),
    pasarbubar: initModule({ graph: GPSGraphs.pasarbubar }),
    plawangan: initModule({ graph: GPSGraphs.plawangan }),
    selo: initModule({ graph: GPSGraphs.selo }),
  },
}
