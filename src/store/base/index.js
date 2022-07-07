import { DATETIME_FORMAT } from '@/constants/date'
import { toUnixMiliSeconds } from '@/utils/series'
import client from '@/utils/client'

import {
  SET_ANNOTATION_OPTIONS,
  SET_ANNOTATIONS,
  SET_DATA,
  SET_END_TIME,
  SET_ERROR,
  SET_LAST_UPDATED,
  SET_PERIOD,
  SET_START_TIME,
  SET_CANCEL_TOKEN,
} from './mutations'
import { UPDATE_ANNOTATIONS } from './actions'

/**
 * Base state stores generic series states.
 */
export const baseState = {
  /**
   * `data` stores actual series data. For example array of objects fetched from
   * external API.
   */
  data: [],
  /**
   * `endTime` stores end time for particular period. The value may stored in
   * moment object type.
   */
  endTime: null,
  /**
   * `error` stores error information when fetching certain external API failed.
   */
  error: null,
  /**
   * `lastUpdated` stores timestamp when last fetched occurred. The value may
   * stored in moment object type.
   */
  lastUpdated: null,
  /**
   * `period` stores period types.
   */
  period: null,
  /**
   * `startTime` stores start time for particular period. The value may stored
   * in moment object type.
   */
  startTime: null,
  /**
   * `annotationOptions` stores array of annotation configuration options. See
   * the options at @/components/event-annotation/annotations.js
   */
  annotationOptions: [],
  /**
   * `annotations` stores actual data of annotations fetched from external API.
   */
  annotations: [],
  /**
   * Axios cancellation token.
   */
  cancelToken: null,
}

/**
 * Base mutations object.
 */
export const baseMutations = {
  [SET_DATA](state, data) {
    state.data = data
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
  [SET_START_TIME](state, value) {
    state.startTime = value
  },
  [SET_END_TIME](state, value) {
    state.endTime = value
  },
  [SET_ANNOTATION_OPTIONS](state, options) {
    state.annotationOptions = options
  },
  [SET_ANNOTATIONS](state, annotations) {
    state.annotations = annotations
  },
  [SET_CANCEL_TOKEN](state, token) {
    state.cancelToken = token
  },
}

/**
 * Base actions object. All action types must be an asynchronous functions.
 */
export const baseActions = {
  /**
   * Update annotations by fetching to the external API. Annotations data are
   * returned in the format of ECharts mark line options.
   */
  async [UPDATE_ANNOTATIONS]({ commit, state }) {
    const annotationData = []

    const checkedAnnotations = state.annotationOptions.filter(
      (v) => v.checked === true
    )

    const requests = checkedAnnotations.map((annotation, index) => {
      if (annotation.isEarthquakeEvent) {
        return client.get('/bulletin/', {
          params: {
            eventdate__gte: state.startTime.format(DATETIME_FORMAT),
            eventdate__lt: state.endTime.format(DATETIME_FORMAT),
            eventtype: annotation.name,
            nolimit: true,
          },
          dataIndex: index,
        })
      } else {
        return annotation
      }
    })

    await Promise.all(requests)
      .then((responses) => {
        responses.forEach((response) => {
          if (response.config !== undefined) {
            // Check for fetched (dynamic) event annotations.
            const annotation = checkedAnnotations[response.config.dataIndex]

            response.data.forEach((v) => {
              annotationData.push({
                name: annotation.name,
                xAxis: toUnixMiliSeconds(v.eventdate),
                label: {
                  formatter: '',
                  position: 'end',
                },
                lineStyle: {
                  color: annotation.color,
                  type: annotation.lineStyle,
                },
              })
            })
          } else {
            // Check for non-fetched (static) event annotations.
            annotationData.push({
              name: response.name,
              xAxis: response.xValue,
              label: {
                formatter: '',
                position: 'end',
              },
              lineStyle: {
                color: response.color,
                type: response.lineStyle,
              },
            })
          }
        })

        commit(SET_ANNOTATIONS, annotationData)
      })
      .catch((error) => {
        commit(SET_ERROR, error)
      })
  },
}
