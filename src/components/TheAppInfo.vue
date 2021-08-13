<template>
  <div class="app-info">
    <h6>About Display Device</h6>
    <BCard class="app-info-card mt-3" no-body>
      <BListGroup flush>
        <BListGroupItem>
          <LogoIcon />
        </BListGroupItem>

        <BListGroupItem>
          <div>
            Version: <span class="secondary">{{ versionInfo.version }}</span>
          </div>
          <div>
            Build:
            <span class="secondary">{{ versionInfo.commitHash }}</span>
          </div>
          <div>
            Build date:
            <span class="secondary">{{ versionInfo.buildDate }} UTC</span>
          </div>
        </BListGroupItem>

        <BListGroupItem>
          <BLink
            href="https://github.com/bpptkg/display-device"
            target="_blank"
          >
            Developer resources
          </BLink>
        </BListGroupItem>

        <BListGroupItem>
          <BLink
            href="https://github.com/bpptkg/display-device/issues"
            target="_blank"
          >
            Report an issue
          </BLink>
        </BListGroupItem>
      </BListGroup>
    </BCard>

    <BCard class="app-info-card mt-3">
      <div class="secondary">BPPTKG Display Device</div>

      <div class="secondary">
        Copyright &copy; 2020-{{ thisYear }} BPPTKG. All rights reserved.
      </div>

      <div class="secondary mt-2">
        Display Device App is made possible by BPPTKG with much open source
        software by developer community.
      </div>
    </BCard>
  </div>
</template>

<script>
import moment from 'moment'
import { BCard, BLink, BListGroup, BListGroupItem } from 'bootstrap-vue'
import { LogoIcon } from '@/components/icons'
import versionInfo from '@/utils/version'

export default {
  name: 'TheAppInfo',
  components: {
    BCard,
    LogoIcon,
    BLink,
    BListGroup,
    BListGroupItem,
  },
  computed: {
    thisYear() {
      return moment().format('YYYY')
    },
    versionInfo() {
      return versionInfo
    },
  },
}
</script>

<style lang="scss" scoped>
.app-info {
  font-size: 14px;
}

.app-info-card {
  box-shadow: 0 1px 2px 0 rgb(60 64 67 / 30%), 0 2px 4px 2px rgb(60 64 67 / 15%);
  background: #fff;
  border-radius: 8px;
}

.secondary {
  color: #5f6368;
  font-weight: 400;
}
</style>
