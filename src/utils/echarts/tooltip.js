import moment from 'moment'
import { get } from 'lodash'
import { DATE_FORMAT } from '@/constants/date'
import { createCircleTemplate } from '../series'

export const createTooltipWrapper = (
  template,
  {
    maxWidth = '300px',
    maxHeight = '300px',
    columnCount = 1,
    columnGap = '10px',
    fontSize = '0.85rem',
    lineHeight = '0.92rem',
  } = {}
) => {
  const style = `
    max-width: ${maxWidth};
    max-height: ${maxHeight};
    overflow-y: auto;
    overflow-x: auto;
    font-size: ${fontSize};
    line-height: ${lineHeight};
    column-count: ${columnCount};
    column-gap: ${columnGap};
  `

  if (Array.isArray(template) && template.length) {
    const header = template[0]
    const body = template.slice(1).join('')

    return `
      <div>
        ${header}
        <div style="${style}">
          ${body}
        </div>
      </div>
    `
  } else {
    return `
      <div style="${style}">
        ${template}
      </div>
    `
  }
}

export const DEFAULT_FRACTION_DIGITS = 2
export const SeriesProps = {
  VALUE_PREFIX: 'valuePrefix',
  VALUE_SUFFIX: 'valueSuffix',
  VALUE_DECIMALS: 'valueDecimals',
  VALUE_FORMATTER: 'valueFormatter',
  NAME: 'name',
}

/**
 * Create default tooltip formatter function.
 *
 * Options:
 * - `format` {String}: Timestamp date format.
 * - `valueDecimals` {Integer}: Numeric digit precision for each item value.
 * - `valueFormatter` {Function}: Value formatter function. The first argument
 *   are current series value in array, and the second argument are current
 *   series props.
 * - `valuePrefix {String}: Prefix to be added to each item value. Value prefix
 *   in the series props will take precedence than this value.
 * - `valueSuffix` {String}: Suffix to be added to each item value. Value suffix
 *   in the series props will take precedence than this value.
 * - `seriesProps` {Object}: Series properties options to format current item
 *   value. Any global options will be overrided with series options if any
 *   option present in the properties.
 *
 * @param {Object} options Options to refine formatter function.
 * @returns {Function} Formatter function.
 */
export const defaultTooltipFormatter = ({
  format = DATE_FORMAT,
  valueDecimals = DEFAULT_FRACTION_DIGITS,
  valueFormatter = undefined,
  valuePrefix = '',
  valueSuffix = '',
  seriesProps = {},
  noData = '',
  adaptive = false,
  adaptiveOptions = {},
  excludeZero = false, // Only apply for multiple items.
} = {}) => {
  // Return formatter function.
  return (params) => {
    if (Array.isArray(params) && params.length) {
      const template = []

      params.forEach((param, index) => {
        const { seriesName, value, color } = param
        const props = get(seriesProps, seriesName)

        if (index === 0) {
          template.push(`<div>${moment(value[0]).format(format)}</div>`)
        }

        if (excludeZero === true && value[1] === 0) {
          // Pass
        } else {
          const sValueDecimals = get(props, SeriesProps.VALUE_DECIMALS)
          const sValueFormatter = get(props, SeriesProps.VALUE_FORMATTER)
          const sValuePrefix = get(props, SeriesProps.VALUE_PREFIX, '')
          const sValueSuffix = get(props, SeriesProps.VALUE_SUFFIX, '')
          const sName = get(props, SeriesProps.NAME, '')

          const valueFormatted = sValueFormatter
            ? sValueFormatter(value, props)
            : valueFormatter
            ? valueFormatter(value, props)
            : Number.isFinite(value[1])
            ? `${sValuePrefix || valuePrefix}${value[1].toFixed(
                typeof sValueDecimals === 'number'
                  ? sValueDecimals
                  : valueDecimals
              )}${sValueSuffix || valueSuffix}`
            : noData

          template.push(`
          <div>${createCircleTemplate(color)}
          ${sName || seriesName}: ${valueFormatted}</div>`)
        }
      })

      if (adaptive === true) {
        return createTooltipWrapper(template, { ...adaptiveOptions })
      } else {
        return template.join('')
      }
    } else {
      const { seriesName, value, color, name, componentType } = params
      if (componentType === 'markLine') {
        return `${moment(value[0]).format(format)}<br />
        ${createCircleTemplate(color)}
        ${name}`
      } else {
        const props = get(seriesProps, seriesName)

        const sValueDecimals = get(props, SeriesProps.VALUE_DECIMALS)
        const sValueFormatter = get(props, SeriesProps.VALUE_FORMATTER)
        const sValuePrefix = get(props, SeriesProps.VALUE_PREFIX, '')
        const sValueSuffix = get(props, SeriesProps.VALUE_SUFFIX, '')
        const sName = get(props, SeriesProps.NAME, '')

        const valueFormatted = sValueFormatter
          ? sValueFormatter(value, props)
          : valueFormatter
          ? valueFormatter(value, props)
          : Number.isFinite(value[1])
          ? `${sValuePrefix || valuePrefix}${value[1].toFixed(
              typeof sValueDecimals === 'number'
                ? sValueDecimals
                : valueDecimals
            )}${sValueSuffix || valueSuffix}`
          : noData

        const template = `<div>${moment(value[0]).format(format)}</div>
        <div>${createCircleTemplate(color)} 
        ${sName || seriesName}: ${valueFormatted}</div>`

        if (adaptive === true) {
          return createTooltipWrapper(template, { ...adaptiveOptions })
        } else {
          return template
        }
      }
    }
  }
}
