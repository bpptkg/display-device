<template>
  <SidebarMenu :menu="menu" :collapsed="isCollapsed" @item-click="onItemClick">
    <template #header>
      <NewVersion />
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
  GBInsarIcon,
  GpsIcon,
  GravityIcon,
  HomeIcon,
  InfographicIcon,
  LavaDomeIcon,
  MagneticIcon,
  ModelingIcon,
  ObservationIcon,
  SeismicIcon,
  ThermalIcon,
  TiltmeterIcon,
  VisualIcon,
  WeatherIcon,
} from './icons'
import { EqualizerIcon } from './icons/av'
import { InfoIcon } from './icons/action'
import NewVersion from './NewVersion.vue'

export default {
  name: 'TheSidebarMenu',
  components: {
    NewVersion,
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
              title: 'RF & AP Energy',
              href: '/seismic/equivalent-energy',
            },
            {
              title: 'Helicorder',
              href: '/seismic/helicorder',
            },
            {
              title: 'REDPy',
              href: '/seismic/redpy',
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
            {
              title: 'Modeling',
              href: '/gps/graphs',
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
          child: [
            {
              title: 'Vogamos',
              href: '/geochemistry/vogamos',
            },
            {
              title: 'DOAS',
              href: '/geochemistry/doas/babadan',
            },
            {
              title: 'DOAS-Scan',
              href: '/geochemistry/doas-scan',
            },
            {
              title: 'UV Camera',
              href: '/geochemistry/uvcamera',
            },
          ],
        },
        {
          title: 'GBInSAR',
          icon: GBInsarIcon,
          href: '/gbinsar',
          child: [
            {
              title: 'Babadan Area',
              href: '/gbinsar/babadanarea',
            },
            {
              title: 'Babadan Point',
              href: '/gbinsar/babadanpoint',
            },
            {
              title: 'Turgo Area',
              href: '/gbinsar/turgoarea',
            },
          ],
        },
        {
          title: 'Lava Domes',
          icon: LavaDomeIcon,
          href: '/lava-domes',
          child: [
            {
              title: 'Barat Daya',
              href: '/lava-domes/barat-daya',
            },
            {
              title: 'Tengah Kawah',
              href: '/lava-domes/tengah-kawah',
            },
          ],
        },
        {
          title: 'Weather',
          icon: WeatherIcon,
          child: [
            {
              title: 'Pasarbubar',
              href: '/weather/pasarbubar2',
            },
            {
              title: 'Pasarbubar (Old)',
              href: '/weather/pasarbubar',
            },
            {
              title: 'Klatakan',
              href: '/weather/klatakan',
            },
            {
              title: 'Labuhan',
              href: '/weather/labuhan',
            },
            {
              title: 'Selo',
              href: '/weather/selo',
            },
            {
              title: 'Babadan',
              href: '/weather/babadan',
            },
            {
              title: 'Jurang Jero',
              href: '/weather/jurangjero',
            },
            {
              title: 'Jrakah',
              href: '/weather/jrakah',
            },
            {
              title: 'Kaliurang',
              href: '/weather/kaliurang',
            },
            {
              title: 'Ngepos',
              href: '/weather/ngepos',
            },
            {
              title: 'Rainfall Station',
              href: '/weather/rainfall-station',
            },
            {
              title: 'Rainfall Daily',
              href: '/weather/rainfall-daily',
            },
            {
              title: 'Rainfall Catalog',
              href: '/rainfall-catalog',
            },
          ],
        },
        {
          title: 'Observation',
          icon: ObservationIcon,
          child: [
            {
              title: 'RF & AP',
              href: '/observation',
            },
            {
              title: 'Visual',
              href: '/visual',
            },
          ],
        },
        {
          title: 'Magnetic',
          icon: MagneticIcon,
          href: '/magnetic',
          child: [
            {
              title: 'Magnetic Babadan',
              href: '/magnetic/babadan',
            },
            {
              title: 'Magnetic Imogiri',
              href: '/magnetic/imogiri',
            },
          ],
        },
        {
          title: 'Thermal',
          icon: ThermalIcon,
          child: [
            {
              title: 'Thermal Axis Kaliurang',
              href: '/thermal-axis/kaliurang',
            },
            {
              title: 'Thermal Axis Jurang Jero',
              href: '/thermal-axis/jurangjero',
            },
            {
              title: 'Thermal Axis Deles',
              href: '/thermal-axis/deles',
            },
            {
              title: 'Thermal Axis Babadan',
              href: '/thermal-axis/babadan',
            },
          ],
        },
        {
          title: 'Modeling',
          icon: ModelingIcon,
          child: [
            {
              title: 'Tiltmeter Modeling',
              href: '/modeling/tilt',
            },
            {
              title: 'GPS Modeling',
              href: '/modeling/gps',
            },
          ],
        },
        {
          title: 'Gravity',
          icon: GravityIcon,
          href: '/gravity',
          child: [
            {
              title: 'Overview',
              href: '/gravity/overview',
            },
            {
              title: 'Gravity Obs',
              href: '/gravity/obs',
            },
          ],
        },
        {
          title: 'Infographic',
          icon: InfographicIcon,
          href: '/infographic',
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
