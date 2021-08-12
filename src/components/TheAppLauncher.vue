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
          src: '/svg/file.svg',
          href: '/file-manager',
          text: 'File Manager',
          visible: true,
        },
        {
          src: '/svg/report.svg',
          href: '/data-entry',
          text: 'Data Entry',
          visible: ME_POSITION_NAMES.includes(this.userPositionName),
        },
        {
          src: '/svg/task.svg',
          href: '/assignment/',
          text: 'Assignment',
          visible: true,
        },
        {
          src: '/svg/analytic.svg',
          href: '/data-analysis',
          text: 'Data Analysis',
          visible: ME_POSITION_NAMES.includes(this.userPositionName),
        },
        {
          src: '/svg/display.svg',
          href: '/display-device',
          text: 'Display Device',
          visible: ME_POSITION_NAMES.includes(this.userPositionName),
        },
        {
          src: '/svg/maintenance.svg',
          href: '/maintenance',
          text: 'Maintenance',
          visible: ME_POSITION_NAMES.includes(this.userPositionName),
        },
        {
          src: '/svg/beaker.png',
          href: '/lims',
          text: 'LIMS',
          visible: PL_POSITION_NAMES.includes(this.userPositionName),
        },
        {
          src: '/svg/broadcast.jpg',
          href: '/broadcasting',
          text: 'Broadcast',
          visible: ME_POSITION_NAMES.includes(this.userPositionName),
        },
        {
          src: '/svg/gallery.jpg',
          href: '/gallery',
          text: 'Gallery',
          visible: true,
        },
      ]
    },
  },
}
</script>
