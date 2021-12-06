<template>
  <div class="wrapper">
    <Helicorder class="column" code="PASB_BHZ_MP_10" auto-refresh />
    <Helicorder class="column" code="DELS_SHZ_MP_01" auto-refresh />
  </div>
</template>

<script>
import Helicorder from '@/views/helicorder/Helicorder'

export default {
  name: 'HelicorderView',
  components: {
    Helicorder,
  },
}
</script>

<style lang="scss" scoped>
.wrapper {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 50px;
  display: flex;
  flex-wrap: wrap;
}

.column {
  flex: 50%;
}

@media (max-width: 767px) {
  .wrapper {
    position: static;
    display: block;
    margin-top: 50px;
  }
}
</style>
