<template>
  <div class="app-info">
    <h6>About Davis</h6>
    <BCard class="app-info-card mt-3" no-body>
      <BListGroup flush>
        <BListGroupItem>
          <LogoIcon />
        </BListGroupItem>

        <BListGroupItem>
          Davis is a web app that provides various charts and analytics
          information about Merapi Volcano monitoring data.
        </BListGroupItem>

        <BListGroupItem>
          <div>
            Version: <span class="secondary">{{ versionInfo.version }}</span>
          </div>
          <div>
            Build date:
            <span class="secondary">
              {{ versionInfo.buildDate }} ({{ buildDateDuration }})
            </span>
          </div>
        </BListGroupItem>

        <BListGroupItem
          href="https://github.com/bpptkg/display-device"
          target="_blank"
        >
          <div class="d-flex justify-content-between">
            <div>Developer resources</div>
            <LaunchIcon />
          </div>
        </BListGroupItem>

        <BListGroupItem
          href="https://github.com/bpptkg/display-device/issues"
          target="_blank"
        >
          <div class="d-flex justify-content-between">
            <div>Report an issue</div>
            <LaunchIcon />
          </div>
        </BListGroupItem>
      </BListGroup>
    </BCard>

    <BCard class="app-info-card mt-3">
      <div class="secondary">BPPTKG Davis</div>

      <div class="secondary">
        Copyright &copy; 2020-{{ thisYear }} BPPTKG. All rights reserved.
      </div>

      <div class="secondary mt-2">
        Data Visualization App is made possible by BPPTKG with much open source
        software by developer community.
      </div>
    </BCard>
  </div>
</template>

<script>
import moment from 'moment'
import { BCard, BListGroup, BListGroupItem } from 'bootstrap-vue'
import { LogoIcon } from '@/components/icons'
import { LaunchIcon } from '@/components/icons/action'
import versionInfo from '@/utils/version'

export default {
  name: 'TheAppInfo',
  components: {
    BCard,
    LaunchIcon,
    LogoIcon,
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
    buildDateDuration() {
      return moment(this.versionInfo.buildDate).fromNow()
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
  border-radius: 10px;

  & > .list-group:first-child {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }

  & > .list-group:last-child {
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
  }
}

.secondary {
  color: #5f6368;
  font-weight: 400;
}
</style>
