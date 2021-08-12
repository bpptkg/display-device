<template>
  <div class="wrapper">
    <div class="content">
      <BCol md="6">
        <TheAppInfo />
      </BCol>
    </div>
  </div>
</template>

<script>
import { BCol } from 'bootstrap-vue'
import TheAppInfo from '@/components/TheAppInfo'

export default {
  name: 'AppInfoView',
  components: {
    BCol,
    TheAppInfo,
  },
}
</script>

<style lang="scss" scoped>
.wrapper {
  background-color: #fff;
}

.content {
  margin-top: 70px;
  margin-bottom: 50px;
  display: flex;
  justify-content: center;
}
</style>
