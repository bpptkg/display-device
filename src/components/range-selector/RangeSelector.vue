<template>
  <div>
    <BDropdown class="rs-btn" v-bind="$attrs" v-on="$listeners">
      <template #button-content>
        <i v-if="!hidePeriodLabel" class="data-menu-label">Period: </i>
        <span class="data-menu-button">{{
          selectedItem.text ? selectedItem.text : ''
        }}</span>
      </template>
      <BDropdownItem
        v-for="(item, index) in items"
        :key="index"
        :active="item === selectedItem"
        @click="clickEvent(item)"
      >
        {{ item.text }}
      </BDropdownItem>
      <BDropdownDivider v-if="customEnabled" />
      <BDropdownItem
        v-if="customEnabled"
        :active="selectedItem.type === 'custom'"
        @click="showCustomModal(custom)"
      >
        {{ custom.text }}
      </BDropdownItem>
    </BDropdown>
    <BModal ref="modal" title="Custom period" size="lg">
      <BForm>
        <BFormGroup>
          <template #label>
            <span class="rs-custom-input-label">Start time</span>
          </template>
          <DateTimePicker v-model="start" :config="options" />
        </BFormGroup>
        <div class="d-flex">
          <BLink
            v-for="(value, index) in previousStart"
            :key="index"
            class="mr-2 mb-2"
            @click="setCustomStart(value)"
          >
            <small>{{ value }}</small>
          </BLink>
        </div>

        <BFormGroup>
          <template #label>
            <span class="rs-custom-input-label">End time</span>
          </template>
          <DateTimePicker v-model="end" :config="options" />
        </BFormGroup>
        <div class="d-flex">
          <BLink
            v-for="(value, index) in previousEnd"
            :key="index"
            class="mr-2 mb-2"
            @click="setCustomEnd(value)"
          >
            <small>{{ value }}</small>
          </BLink>
        </div>

        <div
          v-if="!isCustomValid"
          role="alert"
          aria-live="true"
          class="custom-invalid-feedback"
        >
          <ErrorOutlineIcon size="sm" color="#dc3545" />
          <label>
            <small>
              {{ customInvalidFeedback }}
            </small>
          </label>
        </div>
      </BForm>
      <template #modal-footer>
        <BButton
          variant="primary"
          :disabled="!isCustomValid"
          @click="clickEvent(custom)"
        >
          Apply
        </BButton>
      </template>
    </BModal>
  </div>
</template>

<script>
import moment from 'moment'
import {
  BButton,
  BDropdown,
  BDropdownDivider,
  BDropdownItem,
  BModal,
  BForm,
  BFormGroup,
  BLink,
} from 'bootstrap-vue'
import { DateRangeTypes } from '@/constants/date'
import { calculatePeriod } from '@/utils/datetime'
import DateTimePicker from '@/components/base/datetime-picker'
import { ErrorOutlineIcon } from '@/components/icons/alert'

const DEFAULT_CUSTOM_CACHE_KEY = 'rangeSelector'

function getCustomRangeCache(key) {
  if (localStorage.getItem(key) !== null) {
    return JSON.parse(localStorage.getItem(key))
  } else {
    return []
  }
}

function setCustomRangeCache(key, value) {
  let history = []
  if (localStorage.getItem(key) !== null) {
    history = JSON.parse(localStorage.getItem(key))
  }
  const previousValues = [...history.slice(0, 2)]
  if (!previousValues.includes(value)) {
    localStorage.setItem(key, JSON.stringify([value, ...previousValues]))
  }
}

export default {
  name: 'RangeSelector',
  components: {
    BButton,
    BDropdown,
    BDropdownDivider,
    BDropdownItem,
    BForm,
    BFormGroup,
    BModal,
    DateTimePicker,
    ErrorOutlineIcon,
    BLink,
  },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    selected: {
      type: [Number, Object],
      default: null,
    },
    customEnabled: {
      type: Boolean,
      default: false,
    },
    customText: {
      type: String,
      default: 'Custom',
    },
    maxCustomDuration: {
      type: Object,
      default: null,
    },
    customCacheKey: {
      type: String,
      default: DEFAULT_CUSTOM_CACHE_KEY,
    },
    hidePeriodLabel: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selectedItem: {},
      start: '',
      end: '',
      options: {
        format: 'YYYY-MM-DD HH:mm:ss',
        showClose: true,
        showClear: true,
        useCurrent: 'day',
      },
    }
  },
  computed: {
    custom() {
      return {
        type: DateRangeTypes.CUSTOM,
        text: this.customText,
      }
    },
    isCustomSet() {
      return !((!this.start && !this.end) || !this.start || !this.end)
    },
    isCustomDurationValid() {
      if (this.maxCustomDuration !== null) {
        const { type, count } = this.maxCustomDuration
        const start = moment(this.start)
        const end = moment(this.end)
        const duration = moment.duration(end.diff(start))
        return duration.as(type) <= count
      } else {
        return true
      }
    },
    isCustomValid() {
      return (
        this.isCustomSet &&
        this.checkDatetimeRange(this.start, this.end) &&
        this.isCustomDurationValid
      )
    },
    customInvalidFeedback() {
      if (!this.isCustomSet) {
        return 'Enter period values'
      } else {
        if (!this.checkDatetimeRange(this.start, this.end)) {
          return 'Start time cannot be greater than end time'
        }
        if (!this.isCustomDurationValid) {
          const { count, type } = this.maxCustomDuration
          return `Period cannot be greater than ${count} ${type}`
        }
        return ''
      }
    },
    previousStart: {
      get() {
        // Checking cache key prevent global variable overwrite.
        if (this.customCacheKey !== DEFAULT_CUSTOM_CACHE_KEY) {
          const key = `${this.customCacheKey}/start`
          return getCustomRangeCache(key)
        } else {
          return []
        }
      },
      set(value) {
        const key = `${this.customCacheKey}/start`
        setCustomRangeCache(key, value)
      },
    },
    previousEnd: {
      get() {
        // Checking cache key prevent global variable overwrite.
        if (this.customCacheKey !== DEFAULT_CUSTOM_CACHE_KEY) {
          const key = `${this.customCacheKey}/end`
          return getCustomRangeCache(key)
        } else {
          return []
        }
      },
      set(value) {
        const key = `${this.customCacheKey}/end`
        setCustomRangeCache(key, value)
      },
    },
  },
  mounted() {
    this.setSelectedPeriod(this.selected)
  },
  methods: {
    clickEvent(item) {
      this.selectedItem = item
      if (item.type === DateRangeTypes.CUSTOM) {
        if (!this.isCustomValid) return
        const periodConf = { ...item, start: this.start, end: this.end }
        this.$emit('period-selected', item, calculatePeriod(periodConf))
        this.$refs.modal.hide()

        this.previousStart = this.start
        this.previousEnd = this.end
      } else {
        const periodConf = { ...item }
        this.$emit('period-selected', item, calculatePeriod(periodConf))
      }
    },
    showCustomModal(item) {
      this.selectedItem = item
      this.$refs.modal.show()
    },
    checkDatetimeRange(start, end) {
      const startTime = typeof start === 'string' ? moment(start) : start
      const endTime = typeof end === 'string' ? moment(end) : end
      return endTime >= startTime
    },
    setSelectedPeriod(value) {
      if (typeof value === 'number') {
        const length = this.items.length
        if (value < 0 || value >= length) return
        this.selectedItem = this.items[value]
      } else if (typeof value === 'object' && value !== null) {
        this.selectedItem = value
      }
    },
    setCustomStart(value) {
      this.start = value
    },
    setCustomEnd(value) {
      this.end = value
    },
  },
}
</script>

<style lang="scss">
.rs-btn {
  & > button {
    color: #24292e;
    background-color: #fff;
    border-color: rgba(27, 31, 35, 0.15);
    border-radius: 5px;
    box-shadow: 0 1px 0 rgba(27, 31, 35, 0.04),
      inset 0 1px 0 hsla(0, 0%, 100%, 0.25);

    &:active,
    &:focus,
    &:hover {
      color: #24292e;
      background-color: #f3f4f6;
      border-color: rgba(27, 31, 35, 0.15);
    }
  }
  &.show {
    & > button {
      background-color: #f3f4f6 !important;
      border-color: rgba(27, 31, 35, 0.15) !important;
    }
    & .dropdown-toggle::after {
      color: #24292e !important;
    }
  }
}
</style>

<style lang="scss" scoped>
.rs-custom-input-label {
  color: #24292e;
  font-size: 0.875rem;
  opacity: 0.75;
}

.data-menu-label {
  color: #24292e;
  font-style: normal;
  opacity: 0.75;
}

.data-menu-button {
  color: #24292e;
}

.custom-invalid-feedback {
  color: #dc3545;
  font-size: 80%;
}

@media (max-width: 575.98px) {
  .data-menu-label {
    display: none;
  }
}
</style>
