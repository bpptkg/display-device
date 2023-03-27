<template>
  <BModal ref="modal" title="Chart Settings" size="lg">
    <BRow class="mb-2">
      <BCol md="6">
        <BFormGroup label="Surface Opacity">
          <BFormSpinbutton
            v-model="currentSettings.surfaceOpacity"
            min="0"
            max="1"
            step="0.05"
          />
        </BFormGroup>

        <BFormGroup label="Surface Shading">
          <BFormSelect
            v-model="currentSettings.surfaceShading"
            :options="surfaceShadingOptions"
          />
        </BFormGroup>

        <BFormGroup>
          <BFormCheckbox
            v-model="currentSettings.showSurfaceColormap"
            name="Show Surface Colormap"
          >
            Show surface colormap
          </BFormCheckbox>
        </BFormGroup>

        <BFormGroup
          label="Surface Colormap"
          :disabled="!currentSettings.showSurfaceColormap"
        >
          <BDropdown
            block
            class="colormap-dropdown"
            menu-class="w-100"
            no-caret
            toggle-class="text-decoration-none"
            variant="link"
          >
            <template #button-content>
              <ColorPalette :colormap="currentSettings.surfaceColormap" />
            </template>
            <div class="colormap-wrapper">
              <BDropdownItem
                v-for="(color, index) in colormap"
                :key="index"
                @click="setSurfaceColormap(color)"
              >
                <ColorPalette class="colormap-palette" :colormap="color" />
                <span class="colormap-label">
                  {{ color | capitalize }}
                </span>
              </BDropdownItem>
            </div>
          </BDropdown>
        </BFormGroup>

        <BFormGroup>
          <BFormCheckbox
            v-model="currentSettings.showSurfaceWireframe"
            name="Show Surface Wireframe"
          >
            Show surface wireframe
          </BFormCheckbox>
        </BFormGroup>

        <BFormGroup
          description="If checked, use hypocenter from BackTrackBB program. Plot only locatable events will have no effect."
        >
          <BFormCheckbox
            v-model="currentSettings.useBtbbHypo"
            name="Use BackTrackBB hypocenter"
          >
            Use BackTrackBB hypocenter
          </BFormCheckbox>
        </BFormGroup>
      </BCol>

      <BCol md="6">
        <BFormGroup label="Theme">
          <BFormSelect
            v-model="currentSettings.theme"
            :options="themeOptions"
          />
        </BFormGroup>

        <BFormGroup label="Time Colormap">
          <BDropdown
            block
            class="colormap-dropdown"
            menu-class="w-100"
            no-caret
            toggle-class="text-decoration-none"
            variant="link"
          >
            <template #button-content>
              <ColorPalette :colormap="currentSettings.timeColormap" />
            </template>
            <div class="colormap-wrapper">
              <BDropdownItem
                v-for="(color, index) in colormap"
                :key="index"
                @click="setTimeColormap(color)"
              >
                <ColorPalette class="colormap-palette" :colormap="color" />
                <span class="colormap-label">
                  {{ color | capitalize }}
                </span>
              </BDropdownItem>
            </div>
          </BDropdown>
        </BFormGroup>

        <BFormGroup>
          <BFormCheckbox
            v-model="currentSettings.showTimeColormapLegend"
            name="Show time colormap legend"
          >
            Show time colormap legend
          </BFormCheckbox>
        </BFormGroup>

        <BFormGroup
          label="Symbol Size"
          :invalid-feedback="symbolSizeInvalidFeedback"
        >
          <BFormInput
            v-model="currentSettings.symbolSize"
            type="number"
            :state="isSymbolSizeValid"
          />
        </BFormGroup>

        <BFormGroup>
          <BFormCheckbox
            v-model="currentSettings.showAxisGrid"
            name="Show 3D axis grid"
          >
            Show 3D axis grid
          </BFormCheckbox>
        </BFormGroup>

        <BFormGroup :description="locatableDescription">
          <BFormCheckbox
            v-model="currentSettings.onlyLocatable"
            name="Plot only locatable events"
          >
            Plot only locatable events
          </BFormCheckbox>
        </BFormGroup>
      </BCol>
    </BRow>

    <template #modal-footer>
      <div class="float-right">
        <BButton @click="$refs.modal.hide()"> Cancel </BButton>
        <BButton
          variant="primary"
          :disabled="!isSettingsValid"
          @click="handleOk"
        >
          Apply
        </BButton>
      </div>
    </template>
  </BModal>
</template>

<script>
import { mapState } from 'vuex'
import {
  BButton,
  BCol,
  BDropdown,
  BDropdownItem,
  BFormCheckbox,
  BFormGroup,
  BFormInput,
  BFormSelect,
  BFormSpinbutton,
  BModal,
  BRow,
} from 'bootstrap-vue'
import { NAMESPACE } from '@/store/seismic/hypocenter'
import { SUPPORTED_COLORMAP } from '@/utils/color'
import { THEMES } from '@/components/echarts/chart-options/hypocenter'
import ColorPalette from '@/components/color/ColorPalette'

const maxSymbolSize = 50

export default {
  name: 'HypocenterChartSettings',
  components: {
    BButton,
    BCol,
    BDropdown,
    BDropdownItem,
    BFormCheckbox,
    BFormGroup,
    BFormInput,
    BFormSelect,
    BFormSpinbutton,
    BModal,
    BRow,
    ColorPalette,
  },
  data() {
    return {
      currentSettings: {},
      previousSettings: {},
      surfaceShadingOptions: [
        { text: 'Color', value: 'color' },
        { text: 'Lambert', value: 'lambert' },
        { text: 'Realistic', value: 'realistic' },
      ],
      colormap: SUPPORTED_COLORMAP,
      themeOptions: [
        { text: 'Light', value: THEMES.light },
        { text: 'Dark', value: THEMES.dark },
      ],
      locatableDescription: `
      If checked, event with location mode 'automatic' and location type 
      'other event' and 'not locatable' will be excluded 
      (only work for manual mode).
      `,
    }
  },
  computed: {
    ...mapState(NAMESPACE, {
      settings: (state) => state.settings,
    }),
    symbolSizeInvalidFeedback() {
      const { symbolSize } = this.currentSettings
      if (symbolSize < 1) {
        return 'Enter valid symbol size'
      } else if (symbolSize > maxSymbolSize) {
        return `Value cannot be greater than ${maxSymbolSize}`
      } else {
        return ''
      }
    },
    isSymbolSizeValid() {
      const { symbolSize } = this.currentSettings
      return symbolSize > 0 && symbolSize <= maxSymbolSize
    },
    isSettingsValid() {
      return this.isSymbolSizeValid
    },
  },
  methods: {
    handleOk() {
      this.$emit('settings-changed', this.currentSettings)
      this.hide()
    },
    handleCancel() {
      this.$emit('settings-changed', this.previousSettings)
      this.hide()
    },
    show() {
      this.init()
      this.$refs.modal.show()
    },
    hide() {
      this.$refs.modal.hide()
    },
    init() {
      this.previousSettings = { ...this.settings }
      this.currentSettings = { ...this.settings }
    },
    setSurfaceColormap(color) {
      this.currentSettings.surfaceColormap = color
    },
    setTimeColormap(color) {
      this.currentSettings.timeColormap = color
    },
  },
}
</script>

<style lang="scss" scoped>
.colormap-dropdown {
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
}

.colormap-wrapper {
  max-height: 300px;
  overflow-y: auto;
}

.colormap-palette {
  width: 50%;
  display: inline-block;
  vertical-align: middle;
}

.colormap-label {
  vertical-align: middle;
  font-size: 12px;
}
</style>
