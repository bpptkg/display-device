<template>
  <div>
    <DNote>
      Interval: {{ startTime.format('YYYY-MM-DD HH:mm:ss') }} -
      {{ endTime.format('YYYY-MM-DD HH:mm:ss') }} ({{ durationHuman }}).
    </DNote>
    <DNote> Last updated <TimeAgo :date="lastUpdated"></TimeAgo>. </DNote>
  </div>
</template>

<script>
import moment from 'moment'

import DNote from '@/components/base/note/DNote'
import TimeAgo from '@/components/time-ago'
import { humanizeDuration } from '@/utils/duration'

export default {
  name: 'InfoNote',
  props: {
    startTime: moment,
    endTime: moment,
    lastUpdated: moment,
  },
  components: {
    DNote,
    TimeAgo,
  },
  computed: {
    durationHuman() {
      return humanizeDuration(this.startTime, this.endTime)
    },
  },
}
</script>
