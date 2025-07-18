import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '@/views/home/HomeView'
import RealtimeSeismic from '@/views/realtime/RealtimeSeismic'
import RealtimeSeismic2 from '@/views/realtime/RealtimeSeismic2'
import RealtimeDeformation from '@/views/realtime/RealtimeDeformation'
import HelicorderView from '@/views/seismic/HelicorderView'

Vue.use(VueRouter)

/**
 * For a view that contains auto update interval, it is better to use static
 * component instead of dynamically importing the component.
 */
const routes = [
  {
    path: '/',
    component: HomeView,
  },
  {
    path: '/layout',
    component: () => import('../views/layout/LayoutView'),
  },
  {
    path: '/realtime',
    component: () => import('../views/realtime/RealtimeView'),
  },
  {
    path: '/realtime/seismic',
    component: RealtimeSeismic,
  },
  {
    path: '/realtime/seismic2',
    component: RealtimeSeismic2,
  },
  {
    path: '/realtime/deformation',
    component: RealtimeDeformation,
  },
  {
    path: '/edm-overview',
    component: () => import('../views/edm/EDMOverview'),
  },
  {
    path: '/edm',
    component: () => import('../views/edm/EDMView'),
    redirect: '/edm/BAB0',
    children: [
      {
        path: ':benchmark',
        components: {
          default: () => import('../views/edm/EDMBenchmarkChart'),
          stats: () => import('../views/edm/EDMBenchmarkStats'),
        },
        props: {
          default: true,
          stats: (route) => route.params,
        },
      },
    ],
  },
  {
    path: '/gps/baseline',
    component: () => import('../views/gps/baseline/GPSBaselineView'),
    redirect: '/gps/baseline/p1',
    children: [
      {
        path: '/gps/baseline/:station',
        components: {
          default: () => import('../views/gps/baseline/GPSBaselineChart'),
          stats: () => import('../views/gps/baseline/GPSBaselineStats'),
        },
        props: {
          default: true,
          stats: (route) => route.params,
        },
      },
    ],
  },
  {
    path: '/gps/coordinate',
    component: () => import('../views/gps/coordinate/GPSCoordinateView'),
    redirect: '/gps/coordinate/babadan',
    children: [
      {
        path: ':station',
        components: {
          default: () => import('../views/gps/coordinate/GPSCoordinateChart'),
          stats: () => import('../views/gps/coordinate/GPSCoordinateStats'),
        },
        props: {
          default: true,
          stats: (route) => route.params,
        },
      },
    ],
  },
  {
    path: '/gps/graphs',
    redirect: '/gps/graphs/summary',
    component: () => import('../views/gps/graphs/GPSGraphView'),
    children: [
      {
        path: ':graph',
        component: () => import('../views/gps/graphs/GPSGraphAdapter'),
        props: true,
      },
    ],
  },
  {
    path: '/gbinsar',
    redirect: '/gbinsar/babadanarea',
    component: () => import('../views/gbinsar/GBInsarView'),
    children: [
      {
        path: ':type',
        component: () => import('../views/gbinsar/GBInsarChart'),
        props: true,
      },
    ],
  },
  {
    path: '/visual',
    redirect: '/visual/kaliurang',
    component: () => import('../views/visual/VisualView'),
    children: [
      {
        path: ':station',
        component: () => import('../views/visual/VisualChart'),
        props: true,
      },
    ],
  },
  {
    path: '/thermal-axis',
    redirect: '/thermal-axis/kaliurang',
    component: () => import('../views/thermal-axis/ThermalAxisView'),
    children: [
      {
        path: ':station',
        component: () => import('../views/thermal-axis/ThermalAxisChart'),
        props: true,
      },
    ],
  },
  {
    path: '/geochemistry',
    component: () => import('../views/geochemistry/GeochemistryView'),
    redirect: '/geochemistry/doas-scan',
    children: [
      {
        path: 'vogamos',
        component: () => import('../views/geochemistry/vogamos/VogamosView'),
      },
      {
        path: 'doas/:station',
        component: () => import('../views/geochemistry/doas/DOASView'),
        props: true,
      },
      {
        path: 'doas-scan',
        component: () => import('../views/doas/DoasScan'),
      },
      {
        path: 'uvcamera',
        component: () => import('../views/uvcamera/UvCam'),
      },
    ],
  },
  {
    path: '/weather',
    redirect: '/weather/pasarbubar2',
    component: () => import('../views/weather/WeatherView'),
    children: [
      {
        path: 'pasarbubar2',
        component: () =>
          import('../views/weather/pasarbubar2/WeatherPasarbubar2View'),
      },
      {
        path: 'pasarbubar',
        component: () =>
          import('../views/weather/pasarbubar/WeatherPasarbubarView'),
      },
      {
        path: 'babadan',
        component: () => import('../views/weather/babadan/WeatherBabadanView'),
      },
      {
        path: 'jurangjero',
        component: () =>
          import('../views/weather/jurangjero/WeatherJurangJeroView'),
      },
      {
        path: 'klatakan',
        component: () =>
          import('../views/weather/klatakan/WeatherKlatakanView'),
      },
      {
        path: 'labuhan',
        component: () => import('../views/weather/labuhan/WeatherLabuhanView'),
      },
      {
        path: 'rainfall-station',
        component: () =>
          import('../views/weather/rainfall-station/RainfallStationView'),
      },
      {
        path: 'rainfall-daily',
        component: () =>
          import('../views/weather/rainfall-daily/RainfallDailyView'),
      },
      {
        path: 'rainfall-catalog',
        component: () =>
          import('../views/weather/rainfall-catalog/RainfallCatalogView'),
      },
      {
        path: 'jrakah',
        component: () => import('../views/weather/jrakah/WeatherJrakahView'),
      },
      {
        path: 'kaliurang',
        component: () =>
          import('../views/weather/kaliurang/WeatherKaliurangView'),
      },
      {
        path: 'ngepos',
        component: () => import('../views/weather/ngepos/WeatherNgeposView'),
      },
      {
        path: 'selo',
        component: () => import('../views/weather/selo/WeatherSeloView'),
      },
    ],
  },
  {
    path: '/rainfall-catalog',
    component: () =>
      import('../views/weather/rainfall-catalog/RainfallCatalogView'),
  },
  {
    path: '/lava-domes',
    redirect: '/lava-domes/barat-daya',
    component: () => import('../views/lava-domes/LavaDomeView'),
    children: [
      {
        path: 'barat-daya',
        component: () => import('../views/lava-domes/LavaDomeSouthwestView'),
      },
      {
        path: 'tengah-kawah',
        component: () => import('../views/lava-domes/LavaDomeCenterView'),
      },
    ],
  },
  {
    path: '/tiltmeter-overview',
    component: () => import('../views/tiltmeter/TiltmeterOverview'),
  },
  {
    path: '/tiltmeter',
    name: 'tiltmeter',
    component: () => import('../views/tiltmeter/TiltmeterView'),
    redirect: '/tiltmeter/platform/grawah',
    children: [
      {
        path: ':type/:station',
        name: 'tiltmeter-chart',
        components: {
          default: () => import('../views/tiltmeter/TiltmeterChart'),
          stats: () => import('../views/tiltmeter/TiltmeterStats'),
        },
        props: {
          default: true,
          stats: (route) => route.params,
        },
      },
    ],
  },
  {
    path: '/thermal',
    component: () => import('../views/thermal/ThermalView'),
    redirect: '/thermal/kaliurang',
    children: [
      {
        path: ':station',
        name: 'thermal-chart',
        components: {
          default: () => import('../views/thermal/ThermalChart'),
          stats: () => import('../views/thermal/ThermalStats'),
        },
        props: { default: true, stats: (route) => route.params },
      },
    ],
  },
  {
    path: '/seismic',
    component: () => import('../views/seismic/SeismicView'),
    redirect: '/seismic/seismicity',
    children: [
      {
        path: 'seismicity',
        component: () => import('../views/seismic/SeismicityView'),
        redirect: '/seismic/seismicity/manual',
        children: [
          {
            path: 'manual',
            component: () => import('../views/seismic/Seismicity'),
          },
          {
            path: 'cluster',
            component: () => import('../views/seismic/SeismicityCluster'),
          },
        ],
      },
      {
        path: 'energy',
        redirect: '/seismic/energy/total',
      },
      {
        path: 'energy/:type',
        component: () => import('../views/seismic/SeismicEnergy'),
        props: true,
        children: [
          {
            path: '',
            component: () => import('../views/seismic/SeismicEnergyChart'),
            props: true,
          },
        ],
      },
      {
        path: 'hypocenter',
        component: () => import('../views/seismic/Hypocenter'),
      },
      {
        path: 'bulletin',
        component: () => import('../views/seismic/SeismicBulletin'),
      },
      {
        path: 'rsam',
        component: () => import('../views/seismic/RsamView'),
      },
      {
        path: 'cluster',
        alias: 'cluster?eventType=VTA',
        component: () => import('../views/seismic/ClusterView'),
        props: (route) => ({ eventType: route.query.eventType || 'VTA' }),
      },
      {
        path: 'equivalent-energy',
        component: () => import('../views/seismic/EquivalentEnergyView'),
      },
    ],
  },
  {
    path: '/seismic/helicorder',
    component: HelicorderView,
  },
  {
    path: '/seismic/redpy',
    component: () => import('../views/seismic/RedpyView'),
  },
  {
    path: '/observation',
    component: () => import('../views/observation/ObservationView'),
    redirect: '/observation/rfap-distance',
    children: [
      {
        path: 'rfap-distance',
        component: () => import('../views/observation/RfapDistanceView'),
      },
      {
        path: 'rfap-direction',
        component: () => import('../views/observation/RfapDirectionView'),
      },
      {
        path: 'rfap-type',
        component: () => import('../views/observation/RfapTypeView'),
      },
    ],
  },
  {
    path: '/about',
    component: () => import('../views/common/AppInfoView'),
  },
  {
    path: '/magnetic',
    redirect: '/magnetic/imogiri',
    component: () => import('../views/magnetic/MagneticView'),
    children: [
      {
        path: ':station',
        component: () => import('../views/magnetic/MagneticChartView'),
        props: true,
      },
    ],
  },
  {
    path: '/infographic',
    component: () => import('@/lib/infographic/InfographicView'),
  },
  {
    path: '/modeling/:type',
    component: () => import('@/lib/modeling/ModelingView'),
    children: [
      {
        path: '',
        component: () => import('@/lib/modeling/ModelingBuilder'),
        props: true,
      },
    ],
  },
  {
    path: '/gravity',
    redirect: '/gravity/obs',
  },
  {
    path: '/gravity/obs',
    component: () => import('../views/gravity/GravityView'),
  },
  {
    path: '/gravity/overview',
    component: () => import('../views/gravity/GravityOverview'),
  },
  {
    path: '*',
    redirect: '/',
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
