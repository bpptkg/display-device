<template>
  <div class="wrapper">
    <BTabs>
      <BTab title="Recent">
        <div class="text-center" v-show="showRecentTabLoading">Loading...</div>
        <iframe
          class="iframe-wrapper"
          src="https://bma.cendana15.com/redpy/overview_recent.html"
          title="REDPy overview recent"
          @load="showRecentTabLoading = false"
        ></iframe>
      </BTab>
      <BTab title="All">
        <div class="text-center" v-show="showOverviewTabLoading">
          Loading...
        </div>
        <iframe
          class="iframe-wrapper"
          src="https://bma.cendana15.com/redpy/overview.html"
          title="REDPy overview"
          @load="showOverviewTabLoading = false"
        ></iframe>
      </BTab>
      <BTab title="Data">
        <div class="p-3">
          <div v-for="link in links" :key="link.href">
            <BLink :href="link.href" target="_blank">{{ link.name }}</BLink>
          </div>
        </div>
      </BTab>
    </BTabs>
  </div>
</template>

<script>
import { BTab, BTabs, BLink } from 'bootstrap-vue'

export default {
  name: 'RedpyView',
  components: {
    BTab,
    BTabs,
    BLink,
  },
  data() {
    return {
      showRecentTabLoading: true,
      showOverviewTabLoading: true,
      links: [
        {
          href: 'https://bma.cendana15.com/redpy/catalog.txt',
          name: 'catalog.txt',
        },
        {
          href: 'https://bma.cendana15.com/redpy/cores.txt',
          name: 'cores.txt',
        },
        {
          href: 'https://bma.cendana15.com/redpy/dailycounts.txt',
          name: 'dailycounts.txt',
        },
        {
          href: 'https://bma.cendana15.com/redpy/orphancatalog.txt',
          name: 'orphancatalog.txt',
        },
        {
          href: 'https://bma.cendana15.com/redpy/triggers.txt',
          name: 'triggers.txt',
        },
        {
          href: 'https://bma.cendana15.com/redpy/swarm.csv',
          name: 'swarm.csv',
        },
        {
          href: 'https://bma.cendana15.com/redpy/triggerswarm.csv',
          name: 'triggerswarm.csv',
        },
      ],
    }
  },
  mounted() {
    this.resetLoading()
  },
  methods: {
    resetLoading() {
      this.showOverviewTabLoading = true
      this.showRecentTabLoading = true
    },
  },
}
</script>

<style lang="scss" scoped>
.wrapper {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 55px;
}

.iframe-wrapper {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 42px;
  bottom: 0;
  left: 0;
  right: 0;
  border: none;
}
</style>
