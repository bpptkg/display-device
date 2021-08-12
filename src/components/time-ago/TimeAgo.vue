<template>
  <span>{{ fromNow }}</span>
</template>

<script>
import moment from 'moment'

export default {
  name: 'TimeAgo',
  props: {
    date: {
      type: [String, moment],
      default: null,
    },
    updateInterval: {
      type: Number,
      default: 60000,
    },
  },
  data() {
    return {
      interval: null,
      fromNow: '',
    }
  },
  computed: {
    timeAgo() {
      if (typeof this.date === 'string') {
        return moment(this.date)
      } else if (typeof this.date === 'object') {
        return this.date
      } else {
        return null
      }
    },
  },
  watch: {
    date() {
      this.updateDiffs()
    },
  },
  mounted() {
    this.interval = setInterval(() => {
      this.updateDiffs()
    }, this.updateInterval)
    this.updateDiffs()
  },
  beforeDestroy() {
    clearInterval(this.interval)
  },
  methods: {
    updateDiffs() {
      if (this.timeAgo !== null) {
        this.fromNow = this.timeAgo.fromNow()
      } else {
        this.fromNow = ''
      }
    },
  },
}
</script>
