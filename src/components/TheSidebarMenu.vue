<template>
  <SidebarMenu :menu="menu" :collapsed="isCollapsed" @item-click="onItemClick">
    <template #header>
      <SidebarMenuHeader @menu-click="toggleMenu" />
    </template>
  </SidebarMenu>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import SidebarMenu from './sidebar-menu/SidebarMenu'
import SidebarMenuHeader from './sidebar-menu/SidebarMenuHeader'
import {
  EdmIcon,
  GasIcon,
  GpsIcon,
  HomeIcon,
  LavaDomeIcon,
  ObservationIcon,
  SeismicIcon,
  TiltmeterIcon,
  WeatherIcon,
} from './icons'
import { EqualizerIcon } from './icons/av'
import { InfoIcon } from './icons/action'

export default {
  name: 'TheSidebarMenu',
  components: {
    SidebarMenu,
    SidebarMenuHeader,
  },
  data() {
    return {
      menu: [
        {
          title: 'Home',
          icon: HomeIcon,
          href: '/',
        },
        {
          title: 'Realtime',
          icon: EqualizerIcon,
          href: '/realtime',
        },
        {
          divider: true,
        },
        {
          title: 'Seismic',
          icon: SeismicIcon,
          child: [
            {
              title: 'Seismicity',
              href: '/seismic/seismicity',
            },
            {
              title: 'Seismic Energy',
              href: '/seismic/energy',
            },
            {
              title: 'Seismic Bulletin',
              href: '/seismic/bulletin',
            },
            {
              title: 'Hypocenter',
              href: '/seismic/hypocenter',
            },
            {
              title: 'Cluster',
              href: '/seismic/cluster',
            },
            {
              title: 'RSAM',
              href: '/seismic/rsam',
            },
            {
              title: 'RF-AP Energy',
              href: '/seismic/equivalent-energy',
            },
          ],
        },
        {
          title: 'EDM',
          icon: EdmIcon,
          child: [
            {
              title: 'Overview',
              href: '/edm-overview',
            },
            {
              title: 'Benchmarks',
              href: '/edm/BAB0',
            },
          ],
        },
        {
          title: 'GPS',
          icon: GpsIcon,
          child: [
            {
              title: 'Baseline',
              href: '/gps/baseline',
            },
            {
              title: 'Coordinate',
              href: '/gps/coordinate',
            },
          ],
        },
        {
          title: 'Tiltmeter',
          icon: TiltmeterIcon,
          child: [
            {
              title: 'Overview',
              href: '/tiltmeter-overview',
            },
            {
              title: 'Stations',
              href: '/tiltmeter/platform/grawah',
            },
          ],
        },
        {
          title: 'Geochemistry',
          icon: GasIcon,
          href: '/geochemistry',
        },
        {
          title: 'Lava Domes',
          icon: LavaDomeIcon,
          href: '/lava-domes',
        },
        {
          title: 'Weather',
          icon: WeatherIcon,
          href: '/weather',
        },
        {
          title: 'Observation',
          icon: ObservationIcon,
          child: [
            {
              title: 'RF-AP Distance',
              href: '/observation/rfap-distance',
            },
            {
              title: 'RF-AP Direction',
              href: '/observation/rfap-direction',
            },
          ],
        },
        {
          divider: true,
        },
        {
          title: 'About',
          icon: InfoIcon,
          href: '/about',
        },
      ],
    }
  },
  computed: {
    ...mapState({
      isCollapsed: (state) => state.sidebarMenu.isCollapsed,
    }),
  },
  methods: {
    ...mapActions(['toggleMenu']),
    onItemClick(event, item) {
      if (!item.child) {
        this.toggleMenu()
      }
    },
  },
}
</script>
