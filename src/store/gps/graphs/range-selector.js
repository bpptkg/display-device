/**
 * Range selector for WebObs GPS graphs are quite different from the rest of
 * Display Device used. For GPS graphs, WebObs used relative range selector.
 * While DD uses `now` time offset, WebObs time offset can be changed to `now`
 * or specific date. So, range selector below is only used to conforms
 * RangeSelector component props, and we need to handle the relative range
 * selector in the event handler.
 */
const rangeSelector = [
  {
    count: 10,
    type: 'day',
    text: '10 days',
    suffix: '10d',
  },
  {
    count: 1,
    type: 'month',
    text: '1 month',
    suffix: '01m',
  },
  {
    count: 60,
    type: 'day',
    text: '60 days',
    suffix: '60d',
  },
  {
    count: 1,
    type: 'year',
    text: '1 year',
    suffix: '01y',
  },
  {
    count: 5,
    type: 'year',
    text: '5 years',
    suffix: '05y',
  },
  {
    // For all data, we use dummy `count` and `type`, because range selector
    // currently not supporting it.
    count: 1,
    type: 'year',
    text: 'All data',
    suffix: 'all',
  },
]

export default rangeSelector
