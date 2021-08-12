<template>
  <BInputGroup>
    <VDateTimePicker v-bind="$attrs" v-on="$listeners" />
    <BInputGroupAppend v-if="!hideIcon">
      <BInputGroupText> <i class="far fa-calendar"></i> </BInputGroupText>
    </BInputGroupAppend>
  </BInputGroup>
</template>

<script>
import { BInputGroup, BInputGroupAppend, BInputGroupText } from 'bootstrap-vue'
import jQuery from 'jquery'
import VDateTimePicker from 'vue-bootstrap-datetimepicker'
import 'pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css'
import '@fortawesome/fontawesome-free/css/all.css'

jQuery.extend(true, jQuery.fn.datetimepicker.defaults, {
  icons: {
    time: 'far fa-clock',
    date: 'far fa-calendar',
    up: 'fas fa-arrow-up',
    down: 'fas fa-arrow-down',
    previous: 'fas fa-chevron-left',
    next: 'fas fa-chevron-right',
    today: 'fas fa-calendar-check',
    clear: 'far fa-trash-alt',
    close: 'far fa-times-circle',
  },
})

export default {
  name: 'DateTimePicker',
  components: {
    VDateTimePicker,
    BInputGroup,
    BInputGroupAppend,
    BInputGroupText,
  },
  props: {
    hideIcon: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
