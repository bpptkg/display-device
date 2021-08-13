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
          src: `/icon/launcher/file.svg`,
          href: '/file-manager',
          text: 'File Manager',
          visible: true,
        },
        {
          src: `/icon/launcher/report.svg`,
          href: '/data-entry',
          text: 'Data Entry',
          visible: ME_POSITION_NAMES.includes(this.userPositionName),
        },
        {
          src: `/icon/launcher/task.svg`,
          href: '/assignment/',
          text: 'Assignment',
          visible: true,
        },
        {
          src: `/icon/launcher/analytic.svg`,
          href: '/data-analysis',
          text: 'Data Analysis',
          visible: ME_POSITION_NAMES.includes(this.userPositionName),
        },
        {
          src: `/icon/launcher/display.svg`,
          href: '/display-device',
          text: 'Display Device',
          visible: ME_POSITION_NAMES.includes(this.userPositionName),
        },
        {
          src: `/icon/launcher/maintenance.svg`,
          href: '/maintenance',
          text: 'Maintenance',
          visible: ME_POSITION_NAMES.includes(this.userPositionName),
        },
        {
          src: `/icon/launcher/beaker.png`,
          href: '/lims',
          text: 'LIMS',
          visible: PL_POSITION_NAMES.includes(this.userPositionName),
        },
        {
          src: `/icon/launcher/broadcast.jpg`,
          href: '/broadcasting',
          text: 'Broadcast',
          visible: ME_POSITION_NAMES.includes(this.userPositionName),
        },
        {
          src: `/icon/launcher/gallery.jpg`,
          href: '/gallery',
          text: 'Gallery',
          visible: true,
        },
      ]
    },
  },
}
</script>
