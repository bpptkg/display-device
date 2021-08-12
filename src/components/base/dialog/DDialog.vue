<template>
  <div v-show="visible" :id="dialogId" :class="dialogClassNames">
    <header
      :id="headerId"
      v-touch:start="dragTouchStart"
      v-touch:moving="dragTouchMoving"
      :class="headerClassNames"
      @mousedown="dragMouseDown"
    >
      <component :is="titleTag" class="header-title">
        {{ title }}
      </component>
      <button type="button" aria-label="Close" class="close" @click="hide">
        <CloseIcon />
      </button>
    </header>
    <div :class="bodyClassNames">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import CloseIcon from '../../icons/navigation/CloseIcon'

export default {
  name: 'DDialog',
  components: {
    CloseIcon,
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    titleTag: {
      type: String,
      default: 'h6',
    },
    titleClass: {
      type: [String, Array, Object],
      default: null,
    },
    headerClass: {
      type: [String, Array, Object],
      default: null,
    },
    bodyClass: {
      type: [String, Array, Object],
      default: null,
    },
    dialogClass: {
      type: [String, Array, Object],
      default: null,
    },
    resizeable: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dialogId: 0,
      headerId: 0,
      pos1: 0,
      pos2: 0,
      pos3: 0,
      pos4: 0,
      visible: false,
    }
  },
  computed: {
    dialogClassNames() {
      return ['dialog', this.dialogClass]
    },
    headerClassNames() {
      return ['dialog-header', this.headerClass]
    },
    bodyClassNames() {
      return [
        'dialog-body',
        this.bodyClass,
        {
          'dialog-resizeable': this.resizeable,
        },
      ]
    },
  },
  created() {
    const random = Math.floor(Math.random() * Math.floor(1000))
    this.dialogId = `dialog-${random}`
    this.headerId = `dialog-header-${random}`
  },
  mounted() {
    const element = document.getElementById(this.dialogId)
    element.style.top = `${window.innerHeight * 0.1}px`
    element.style.left = `${window.innerWidth * 0.1}px`
  },
  methods: {
    dragTouchStart(event) {
      const touch =
        event.touches && event.touches[0] ? event.touches[0] : undefined
      if (touch) {
        this.pos3 = touch.clientX
        this.pos4 = touch.clientY
      }
    },
    dragTouchMoving(event) {
      const touch =
        event.touches && event.touches[0] ? event.touches[0] : undefined
      if (touch) {
        this.pos1 = this.pos3 - touch.clientX
        this.pos2 = this.pos4 - touch.clientY
        this.pos3 = touch.clientX
        this.pos4 = touch.clientY
        const element = document.getElementById(this.dialogId)
        element.style.top = element.offsetTop - this.pos2 + 'px'
        element.style.left = element.offsetLeft - this.pos1 + 'px'
      }
    },
    dragMouseDown(event) {
      event = event || window.event
      event.preventDefault()
      this.pos3 = event.clientX
      this.pos4 = event.clientY
      document.onmouseup = this.closeDragElement
      document.onmousemove = this.elementDrag
    },
    elementDrag(event) {
      event = event || window.event
      event.preventDefault()
      this.pos1 = this.pos3 - event.clientX
      this.pos2 = this.pos4 - event.clientY
      this.pos3 = event.clientX
      this.pos4 = event.clientY
      const element = document.getElementById(this.dialogId)
      element.style.top = element.offsetTop - this.pos2 + 'px'
      element.style.left = element.offsetLeft - this.pos1 + 'px'
    },
    closeDragElement() {
      document.onmouseup = null
      document.onmousemove = null
    },
    toggle() {
      this.visible = !this.visible
    },
    show() {
      this.visible = true
    },
    hide() {
      this.visible = false
    },
  },
}
</script>

<style lang="scss" scoped>
.dialog {
  position: absolute;
  border: 1px solid #dee2e6;
  background-color: #fff;
  border-top-left-radius: 0.3rem;
  border-top-right-radius: 0.3rem;
  z-index: 9999;
}

.dialog-header {
  padding: 10px;
  cursor: move;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 0.5rem 0.5rem;
  border-bottom: 1px solid #dee2e6;
  background-color: #f0f0f0;
  border-top-left-radius: calc(0.3rem - 1px);
  border-top-right-radius: calc(0.3rem - 1px);
}

.dialog-header-title {
  margin-bottom: 0;
  line-height: 1.5;
}

.dialog-resizeable {
  resize: both;
  overflow: auto;
}

.close {
  float: right;
  cursor: pointer;
}
</style>
