import client from '@/utils/client'
import { calculatePeriod as calcPeriod } from '@/utils/datetime'
import moment from 'moment'
import { DATETIME_FORMAT, DateRangeTypes } from '@/constants/date'
import {
  SamplingTypes,
  AggregationTypes,
  DataTypes,
} from '@/constants/tiltmeter'

/**
 * Intercept period calculation to remove time from moment object.
 */
export const calculatePeriod = (period) => {
  const { startTime, endTime } = calcPeriod(period)
  startTime.startOf('day')
  endTime.startOf('day')
  return { startTime, endTime }
}

export const FilterDataType = {
  FILTERED: 'filtered',
  RAW: 'raw',
}

export const periodArray = [
  {
    count: 7,
    type: 'day',
    text: '7 days',
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
]
const defaultPeriod = periodArray[0]

export const initialState = {
  isFetching: false,
  isFetchingLinregress: false,
  isFetchingModeling: false,
  cancelToken: null,
  startTime: null,
  endTime: null,
  data: [],
  error: null,
  dataType: 'tilt',
  depth: 2000,
  initialRadius: 25,
  step: 25,
  maxIteration: 100,
  stations: [],
  selectedStations: [],
  G: 1, // Shear modulus (GPa)
  dP: 0.045, // Source overpressure (GPa)
  v: 0.25, // Poisson's ratio,
  periods: periodArray,
  linregress: {},
  station: null,
  topo: {},
  modeling: {},
}

export const initState = (options = {}) => {
  const { period = defaultPeriod } = options
  const { startTime, endTime } = calculatePeriod(period)
  return {
    ...initialState,
    ...options,
    period,
    startTime,
    endTime,
  }
}

export const getters = {}

// Mutation types.
export const SET_ERROR = 'setError'
export const SET_STATIONS = 'setStations'
export const SET_SELECTED_STATIONS = 'setSelectedStations'
export const SET_LINREGRESS = 'setLinregress'
export const SET_DEPTH = 'setDepth'
export const SET_RADIUS = 'setRadius'
export const SET_STEP = 'setStep'
export const SET_MAX_ITERATION = 'setMaxIteration'
export const SET_SHEAR_MODULUS = 'setShearModulus'
export const SET_SOURCE_OVERPRESSURE = 'setSourceOverpressure'
export const SET_POISSON_RATIO = 'setPoissonRatio'
export const SET_DISP_UX = 'setDispUx'
export const SET_DISP_UZ = 'setDispUz'
export const SET_PERIOD = 'setPeriod'
export const SET_START_TIME = 'setStartTime'
export const SET_END_TIME = 'setEndTime'
export const SET_IS_FETCHING = 'setIsFetching'
export const SET_IS_FETCHING_LINREGRESS = 'setIsFetchingLinregress'
export const SET_IS_FETCHING_MODELING = 'setIsFetchingModeling'
export const SET_DATA = 'setData'
export const SET_STATION_TO_PLOT = 'setStationToPlot'
export const SET_TOPO = 'setTopo'
export const SET_MODELING = 'setModeling'

function convertDispToObject(array) {
  const result = {}
  for (const item of array) {
    const { station, linreg, linreg_point, displacement } = item
    result[station] = { linreg, linreg_point, displacement }
  }
  return result
}

export const mutations = {
  [SET_IS_FETCHING](state, value) {
    state.isFetching = value
  },
  [SET_IS_FETCHING_LINREGRESS](state, value) {
    state.isFetchingLinregress = value
  },
  [SET_IS_FETCHING_MODELING](state, value) {
    state.isFetchingModeling = value
  },
  [SET_PERIOD](state, value) {
    state.period = value
  },
  [SET_START_TIME](state, value) {
    state.startTime = value
  },
  [SET_END_TIME](state, value) {
    state.endTime = value
  },
  [SET_DEPTH](state, value) {
    state.depth = value
  },
  [SET_RADIUS](state, value) {
    state.initialRadius = value
  },
  [SET_STEP](state, value) {
    state.step = value
  },
  [SET_MAX_ITERATION](state, value) {
    state.maxIteration = value
  },
  [SET_SHEAR_MODULUS](state, value) {
    state.G = value
  },
  [SET_SOURCE_OVERPRESSURE](state, value) {
    state.dP = value
  },
  [SET_POISSON_RATIO](state, value) {
    state.v = value
  },
  [SET_ERROR](state, error) {
    state.error = error
  },
  [SET_STATIONS](state, stations) {
    state.stations = stations.map((v) => {
      return {
        ...v,
        value: v.id,
        text: v.name,
        enabled: true,
        ux: 0,
        uz: 0,
        displacement: null,
        linreg: null,
        linreg_point: null,
      }
    })
    state.selectedStations = stations.map((v) => v.id)
    state.station = state.stations[0].id
  },
  [SET_SELECTED_STATIONS](state, stations) {
    state.selectedStations = stations
  },
  [SET_LINREGRESS](state, data) {
    state.linregress = data
    const disp = convertDispToObject(data.regression)
    const stations = [...state.stations]
    stations.forEach((station, index) => {
      const stationId = station.id
      const obj = disp[stationId]
      const ux = obj && obj.displacement ? obj.displacement.ux : null
      const uz = obj && obj.displacement ? obj.displacement.uz : null
      stations[index].ux = ux || 0
      stations[index].uz = uz || 0
      stations[index].displacement =
        obj && obj.displacement ? obj.displacement : {}
      stations[index].linreg = obj && obj.linreg ? obj.linreg : {}
      stations[index].linreg_point =
        obj && obj.linreg_point ? obj.linreg_point : {}
    })

    state.stations = [...stations]
  },
  [SET_DISP_UX](state, { index, value }) {
    state.stations[index].ux = value
  },
  [SET_DISP_UZ](state, { index, value }) {
    state.stations[index].uz = value
  },
  [SET_DATA](state, data) {
    state.data = data
  },
  [SET_STATION_TO_PLOT](state, value) {
    state.station = value
  },
  [SET_TOPO](state, value) {
    state.topo = value
  },
  [SET_MODELING](state, value) {
    state.modeling = value
  },
}

// Action types.
export const FETCH_STATIONS = 'fetchStations'
export const FETCH_DATA = 'fetchData'
export const CALC_LINREGRESS = 'calcLinregress'
export const FETCH_TOPO = 'fetchTopo'
export const CALC_MODELING = 'calcModeling'

export function addTimeInterval(intervalStart, intervalEnd) {
  var newIntervalStart = moment(intervalStart).subtract(2, 'days')
  var newIntervalEnd = moment(intervalEnd).add(2, 'days')

  return {
    start: newIntervalStart,
    end: newIntervalEnd,
  }
}

export const actions = {
  async [FETCH_STATIONS]({ commit, state }) {
    if (state.error) {
      commit(SET_ERROR, null)
    }

    const data = await client
      .get(`/modeling/station/${state.dataType}/`)
      .then((response) => response.data)
      .catch((error) => {
        commit(SET_ERROR, error)
        return []
      })
    commit(SET_STATIONS, data)
  },

  async [CALC_LINREGRESS]({ commit, state }) {
    if (state.error) {
      commit(SET_ERROR, null)
    }

    commit(SET_IS_FETCHING_LINREGRESS, true)

    const data = await client
      .post(`/modeling/linregress/`, {
        data_type: state.dataType,
        start: state.startTime.format(DATETIME_FORMAT),
        end: state.endTime.format(DATETIME_FORMAT),
        stations: state.selectedStations,
      })
      .then((response) => response.data)
      .catch((error) => {
        commit(SET_ERROR, error)
        return {}
      })

    commit(SET_LINREGRESS, data)
    commit(SET_IS_FETCHING_LINREGRESS, false)
  },

  async [FETCH_DATA]({ commit, state }) {
    if (state.error) {
      commit(SET_ERROR, null)
    }

    const { dataType } = state

    const { start, end } = addTimeInterval(state.startTime, state.endTime)

    if (dataType == 'tilt') {
      const requests = state.stations.map((item) => {
        const typeStationName = item.id.split(':')
        let type = typeStationName[0]
        const station = typeStationName[1]

        let url = ''
        let params = {}
        const sampling = SamplingTypes.DAY

        switch (type) {
          case DataTypes.PLATFORM:
            url = `/tiltmeter/${station}/`
            break
          case DataTypes.PLATFORM_RAW:
            url = `/tiltmeter/raw/${station}/`
            break
          case DataTypes.BOREHOLE:
            url = `/tiltborehole/${station}/`
            // Use mid data aggregation for tiltmeter borehole.
            params = {
              mid: true,
            }
            break
          case DataTypes.TLR:
            params =
              sampling === SamplingTypes.DAY
                ? {
                    filter: 'median',
                    median_window: 5,
                    median_aggregation: 'mean',
                  }
                : {
                    filter: 'median',
                    median_window: 5,
                  }

            url = `/tiltmeter/tlr/${station}/`
            break
          default:
            url = `/tiltmeter/${station}/`
        }

        const aggregation =
          sampling === SamplingTypes.DAY && type !== DataTypes.TLR
            ? AggregationTypes.MEAN
            : ''

        return client.get(url, {
          params: {
            timestamp__gte: start.format(DATETIME_FORMAT),
            timestamp__lt: end.format(DATETIME_FORMAT),
            nolimit: true,
            aggregation: aggregation,
            ...params,
          },
        })
      })

      const data = await Promise.all(requests)
        .then((responses) => {
          return responses.map((response) => response.data)
        })
        .catch((error) => {
          commit(SET_ERROR, error)
          return []
        })

      commit(SET_DATA, data)
    } else if (dataType == 'gps') {
      // TODO
    }
  },
  async [FETCH_TOPO]({ commit, state }) {
    if (state.error) {
      commit(SET_ERROR, null)
    }

    const data = await client
      .get(`/topo/profile/`, {
        params: {
          model: 'p1001',
        },
      })
      .then((response) => response.data)
      .catch((error) => {
        commit(SET_ERROR, error)
        return {}
      })

    commit(SET_TOPO, data)
  },
  async [CALC_MODELING]({ commit, state }) {
    commit(SET_IS_FETCHING_MODELING, true)

    const data = await client
      .post('/modeling/iteration/', {
        data_type: state.dataType,
        depth: state.depth,
        radius: state.initialRadius,
        step: state.step,
        max_iteration: state.maxIteration,
        G: state.G * 1e9,
        dP: state.dP * 1e9,
        v: state.v,
        displacements: state.stations
          .filter((s) => state.selectedStations.includes(s.id))
          .map((s) => {
            return {
              station: s.id,
              ux: s.ux || 0,
              uz: s.uz || 0,
            }
          }),
      })
      .then((response) => response.data)
      .catch((error) => {
        commit(SET_ERROR, error)
        return []
      })

    commit(SET_IS_FETCHING_MODELING, false)
    commit(SET_MODELING, data)
  },
}

const tilt = {
  namespaced: true,
  state: initState({ dataType: 'tilt' }),
  getters,
  mutations,
  actions,
}

const gps = {
  namespaced: true,
  state: initState({ dataType: 'gps' }),
  getters,
  mutations,
  actions,
}

export default {
  namespaced: true,
  modules: {
    namespaced: true,
    tilt,
    gps,
  },
}
