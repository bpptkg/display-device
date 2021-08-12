<template>
  <BCard>
    <h6 class="mb-3">
      <span class="font-weight-bold">{{ dateFormatted }}</span>
      <BBadge v-if="isToday" variant="success"> Hari ini </BBadge>
    </h6>

    <BTabs
      v-show="!isEventEmpty"
      v-model="activeTab"
      no-fade
      no-nav-style
      active-nav-item-class="obs-active-nav-item"
      nav-class="obs-nav"
      nav-wrapper-class="obs-nav-wrapper"
    >
      <EventTab
        v-for="(tab, index) in tabs"
        :key="index"
        :title="tab.title"
        :length="tab.events.length"
        :active="activeTab == index"
      >
        <component :is="tab.component" :events="tab.events"></component>
      </EventTab>
    </BTabs>

    <div v-show="isEventEmpty" class="text-center">Tidak ada data.</div>
  </BCard>
</template>

<script>
import { BCard, BTabs, BTab, BBadge } from 'bootstrap-vue'
import { isObject, isString } from 'lodash'
import moment from 'moment'
import 'moment/locale/id'

import AwanPanasList from './AwanPanasList'
import DegassingList from './DegassingList'
import ExplosionList from './ExplosionList'
import LaharList from './LaharList'
import RockfallList from './RockfallList'
import SoundList from './SoundList'
import StaticFireList from './StaticFireList'
import EventTab from './EventTab'

// Most of data is in Indonesian language. So we the locale here.
moment.locale('id')

const DATE_FORMAT = 'D MMM, YYYY'

export default {
  name: 'VolcanicEvent',
  components: {
    BCard,
    BTabs,
    BTab,
    BBadge,
    EventTab,
    AwanPanasList,
    DegassingList,
    ExplosionList,
    LaharList,
    RockfallList,
    SoundList,
    StaticFireList,
  },
  props: {
    date: {
      type: [Object, String],
      default: null,
    },
    eventAwanPanas: {
      type: Array,
      default: () => [],
    },
    eventDegassing: {
      type: Array,
      default: () => [],
    },
    eventExplosion: {
      type: Array,
      default: () => [],
    },
    eventLahar: {
      type: Array,
      default: () => [],
    },
    eventRockfall: {
      type: Array,
      default: () => [],
    },
    eventSound: {
      type: Array,
      default: () => [],
    },
    eventStaticFire: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      activeTab: 0,
    }
  },
  computed: {
    dateFormatted() {
      if (isObject(this.date)) {
        return this.date.format(DATE_FORMAT)
      } else if (isString(this.date)) {
        return moment(this.date).format(DATE_FORMAT)
      } else {
        return this.date.toString()
      }
    },
    isToday() {
      const today = moment().format(DATE_FORMAT)
      return this.dateFormatted === today
    },
    isEventEmpty() {
      return !(
        this.eventAwanPanas.length ||
        this.eventDegassing.length ||
        this.eventExplosion.length ||
        this.eventLahar.length ||
        this.eventRockfall.length ||
        this.eventSound.length ||
        this.eventStaticFire.length
      )
    },
    tabs() {
      const allEvents = [
        {
          title: 'Letusan',
          component: ExplosionList,
          events: this.eventExplosion,
        },
        {
          title: 'Awan Panas',
          component: AwanPanasList,
          events: this.eventAwanPanas,
        },
        {
          title: 'Guguran',
          component: RockfallList,
          events: this.eventRockfall,
        },
        {
          title: 'Hembusan',
          component: DegassingList,
          events: this.eventDegassing,
        },
        {
          title: 'Lahar',
          component: LaharList,
          events: this.eventLahar,
        },
        {
          title: 'Suara',
          component: SoundList,
          events: this.eventSound,
        },
        {
          title: 'Api Diam',
          component: StaticFireList,
          events: this.eventStaticFire,
        },
      ]

      return allEvents.filter((e) => e.events.length)
    },
  },
}
</script>

<style lang="scss">
.obs-active-nav-item {
  background-color: rgba(26, 115, 232, 0.102);
  color: #1a73e8;
}

.obs-nav-wrapper {
  overflow-x: hidden;
  overflow-y: hidden;
  position: relative;
}

.obs-nav {
  overflow-x: auto;
  overflow-y: hidden;
  flex-wrap: nowrap;
  white-space: nowrap;
}

.obs-paddles {
  background-color: #fff;
  border-radius: 36px 0 0 36px;
  border: none;
  bottom: 0;
  box-shadow: -1px 0 6px rgb(0 0 0 / 20%);
  cursor: pointer;
  display: block;
  outline: none;
  overflow: hidden;
  position: absolute;
  top: 0;
  width: 36px;

  &:focus {
    outline: none;
  }

  &-right {
    right: 0;
  }

  &-left {
    left: 0;
    visibility: hidden;
    transform: scaleX(-1);
  }
}
</style>
