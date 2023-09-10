<template>
  <div class="ed-outer-box ed-inline-block">
    <div class="ed-inner-box ed-inline-block">
      <div class="ed-caption ed-inline-block">
        <input
          ref="input"
          :value="value"
          @keyup.enter="onEnter"
          @blur="onBlur"
          class="ed-button-input"
          type="text"
        />
      </div>
      <button @click="toggle" v-clickaway="hide" class="ed-button-dropdown">
        <i class="ed-icon-arrow"></i>
      </button>
      <ul v-show="visible" class="ed-dropdown-content">
        <li v-for="(item, index) in options" :key="index">
          <div v-if="item.divider" class="ed-dropdown-divider"></div>
          <a
            v-else
            @click="selectItem(item)"
            role="menuitem"
            class="ed-dropdown-item"
            >{{ item.text }}</a
          >
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { directive as clickaway } from 'vue-clickaway'

export default {
  props: {
    value: {
      type: String,
      default: '',
    },
    options: {
      type: Array,
      default: () => [],
    },
  },
  components: {},
  directives: {
    clickaway,
  },
  data() {
    return {
      visible: false,
    }
  },
  methods: {
    toggle() {
      this.visible = !this.visible
    },
    show() {
      this.visible = true
    },
    hide() {
      this.visible = false
    },
    onEnter(event) {
      this.$refs.input.blur()
    },
    onBlur(event) {
      this.$emit('input', event.target.value)
      this.$refs.input.value = this.value
    },
    selectItem(item) {
      this.$emit('input', item.value)
    },
  },
}
</script>

<style lang="scss">
.ed-inline-block {
  position: relative;
  display: inline-block;
}

.ed-outer-box {
  margin: 0;
  padding: 0;
  background-color: #fff;
  border: solid 1px rgba(27, 31, 35, 0.15);
  border-color: rgba(27, 31, 35, 0.15);
  border-radius: 5px;
  box-shadow: 0 1px 0 rgba(27, 31, 35, 0.04),
    inset 0 1px 0 hsla(0deg, 0%, 100%, 0.25);
}

.ed-inner-box {
  padding: 0 2px;
  margin: 0 4px 0 3px;
}

.ed-caption {
  padding: 0;
  margin: 0 0 0 -3px;
  width: 48px;
}

.ed-button-input {
  width: 48px;
  margin-top: -1px;
  padding-left: 2px;
  padding-right: 2px;
  color: #1f1f1f;
  height: 28px;
  font-size: 14px;
  padding: 1px 4px;
  box-sizing: border-box;
  background: transparent;
  border-right: 1px solid transparent;
  border: 1px solid transparent;
  font-weight: 400;
  overflow: hidden;
  border-radius: 1px;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  -moz-appearance: none;
  appearance: none;

  &:focus {
    outline: none;
  }
}

.ed-button-dropdown {
  margin-right: 2px;
  background: none;
  margin: 0 -1px 0 -3px;
  width: 12px;
  opacity: 1;
  float: right;
  padding: 0 0 0 1px;
  min-width: 7px;
  vertical-align: middle;
  height: 28px;
  border: none;
}

.ed-icon-arrow {
  display: inline-block;
  vertical-align: 0.255em;
  content: '';
  border-top: 0.3em solid;
  border-right: 0.3em solid transparent;
  border-bottom: 0;
  border-left: 0.3em solid transparent;
  cursor: pointer;
  color: #24292e;
}

.ed-dropdown-content {
  position: absolute;
  left: 0;
  top: 30px;
  background-color: #fff;
  line-height: normal;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 6px 0px;
  z-index: 1;
  list-style-type: none;
}

.ed-dropdown-item {
  display: block;
  width: 100%;
  padding: 0.25rem 1.5rem;
  clear: both;
  font-weight: 400;
  color: #212529;
  text-align: inherit;
  white-space: nowrap;
  background-color: transparent;
  border: 0;
  cursor: pointer;

  &:hover {
    color: #16181b;
    text-decoration: none;
    background-color: #e9ecef;
  }
}

.ed-dropdown-divider {
  border-top: 1px solid rgba(0, 0, 0, 0.12);
  margin: 7px 0;
}
</style>
