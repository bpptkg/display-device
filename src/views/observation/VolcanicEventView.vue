<template>
  <BContainer class="content">
    <div class="d-flex justify-content-end">
      <button class="refresh-button" @click="refresh">Refresh</button>
    </div>

    <VolcanicEvent
      v-for="(report, index) in reports"
      :key="index"
      class="mt-2 mb-3"
      :date="report.date"
      :event-rockfall="report.data.event_avalanches"
      :event-explosion="report.data.event_explosions"
      :event-awan-panas="report.data.event_volcanic_ashes"
      :event-degassing="report.data.event_blasts"
      :event-static-fire="report.data.event_static_fires"
      :event-sound="report.data.event_sounds"
      :event-lahar="report.data.event_lavas"
    />

    <InfiniteLoading
      ref="infiniteLoading"
      :key="infiniteLoadingKey"
      spinner="waveDots"
      @infinite="infiniteHandler"
    >
      <template #error="slotProps">
        Error when loading the data.
        <BLink @click="slotProps.trigger"> Try Again </BLink>
      </template>
    </InfiniteLoading>
  </BContainer>
</template>

<script>
import { mapState } from 'vuex'
import { BContainer, BLink } from 'bootstrap-vue'
import InfiniteLoading from 'vue-infinite-loading'
import { VolcanicEvent } from '@/components/observation'

import { NAMESPACE } from '@/store/observation/event'
import { FETCH_DAILY_REPORT } from '@/store/observation/event/actions'
import {
  TRUNCATE_REPORT,
  RESET_DATE,
} from '@/store/observation/event/mutations'

export default {
  name: 'ReportView',
  components: {
    BContainer,
    BLink,
    InfiniteLoading,
    VolcanicEvent,
  },
  data() {
    return {
      infiniteLoadingKey: '',
    }
  },
  computed: {
    ...mapState(NAMESPACE, {
      reports: (state) => state.reports,
    }),
  },
  created() {
    this.setRandomInfiniteLoadingKey()
  },
  methods: {
    infiniteHandler($state) {
      this.$store.dispatch(NAMESPACE + '/' + FETCH_DAILY_REPORT, $state)
    },
    refresh() {
      this.$store.commit(NAMESPACE + '/' + TRUNCATE_REPORT)
      this.$store.commit(NAMESPACE + '/' + RESET_DATE)
      this.setRandomInfiniteLoadingKey()
    },
    setRandomInfiniteLoadingKey() {
      this.infiniteLoadingKey = Math.round(Math.random() * 1000)
    },
  },
}
</script>

<style lang="scss" scoped>
.content {
  margin-bottom: 50px;
  margin-top: 65px;
}

.refresh-button {
  background-color: #fff;
  border-radius: 25px;
  border: 1px solid #dadce0;
  box-sizing: border-box;
  color: #202124;
  outline: none;
  padding: 5px 20px;
}
</style>
