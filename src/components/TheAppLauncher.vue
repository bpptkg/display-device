<template>
  <AppLauncher :items="items" />
</template>

<script>
import { mapGetters } from 'vuex'
import { NAMESPACE } from '@/store/user/index'
import AppLauncher from './launcher/AppLauncher'

const KA_POSITION_NAMES = [
  'ka-bpptkg',
  'ka-seksi-tu',
  'ka-seksi-mt',
  'ka-seksi-pl',
  'ka-seksi-merapi',
]

const ME_POSITION_NAMES = [...KA_POSITION_NAMES, 'staf-seksi-merapi']
const PL_POSITION_NAMES = [...KA_POSITION_NAMES, 'staf-seksi-pl']
const baseUrl = process.env.BASE_URL

export default {
  name: 'TheAppLauncher',
  components: {
    AppLauncher,
  },
  computed: {
    ...mapGetters(NAMESPACE, ['userPositionName']),
    items() {
      return [
        {
          src: `${baseUrl}icon/launcher/file-manager.svg`,
          href: '/file-manager',
          text: 'File Manager',
          visible: true,
        },
        {
          src: `${baseUrl}icon/launcher/data-entry.svg`,
          href: '/data-entry',
          text: 'Data Entry',
          visible: ME_POSITION_NAMES.includes(this.userPositionName),
        },
        {
          src: `${baseUrl}icon/launcher/assignment.svg`,
          href: '/assignment/',
          text: 'Assignment',
          visible: true,
        },
        {
          src: `${baseUrl}icon/launcher/data-analysis.svg`,
          href: '/data-analysis',
          text: 'Data Analysis',
          visible: ME_POSITION_NAMES.includes(this.userPositionName),
        },
        {
          src: `${baseUrl}icon/launcher/display-device.svg`,
          href: '/display-device',
          text: 'Data Visualization',
          visible: ME_POSITION_NAMES.includes(this.userPositionName),
        },
        {
          src: `${baseUrl}icon/launcher/chart-studio.svg`,
          href: '/chart-studio',
          text: 'Chart Studio',
          visible: ME_POSITION_NAMES.includes(this.userPositionName),
        },
        {
          src: `${baseUrl}icon/launcher/maintenance.svg`,
          href: '/maintenance',
          text: 'Monitoring Network',
          visible: ME_POSITION_NAMES.includes(this.userPositionName),
        },
        {
          src: `${baseUrl}icon/launcher/lims.png`,
          href: '/lims',
          text: 'LIMS',
          visible: PL_POSITION_NAMES.includes(this.userPositionName),
        },
        {
          src: `${baseUrl}icon/launcher/broadcast.jpg`,
          href: '/broadcasting',
          text: 'Broadcast',
          visible: ME_POSITION_NAMES.includes(this.userPositionName),
        },
        {
          src: `${baseUrl}icon/launcher/gallery.jpg`,
          href: '/gallery',
          text: 'Gallery',
          visible: true,
        },
        {
          src: `${baseUrl}icon/launcher/layanan-umum.png`,
          href: '/layananumum',
          text: 'Layanan Umum',
          visible: true,
        },
      ]
    },
  },
}
</script>
