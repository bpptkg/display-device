import { hexToRgb, rgbToHex } from './utils'
import { matplotlibColors } from './matplotlib'

export default class ColorCycle {
  constructor(order, format = 'hex') {
    this.availableFormat = ['rgb', 'hex']
    this.format = format

    if (!Array.isArray(order)) {
      throw new Error('Order must be an array type.')
    }
    this._order = order
  }

  rgb() {
    return this.format === 'rgb'
      ? this._order
      : this._order.map((v) => this._hexToRgb(v))
  }

  hex() {
    return this.format === 'hex'
      ? this._order
      : this._order.map((v) => this._rgbToHex(v[0], v[1], v[2]))
  }

  getRgbColors() {
    return this.rgb()
  }

  getHexColors() {
    return this.hex()
  }

  random(format = 'hex') {
    if (!this._order.length) return null

    const randomIndex = Math.floor(Math.random() * this._order.length) + 1
    return format === 'hex' ? this.hex()[randomIndex] : this.rgb()[randomIndex]
  }

  /**
   * @private
   */
  _hexToRgb(color) {
    return hexToRgb(color)
  }

  /**
   * @private
   */
  _rgbToHex(r, g, b) {
    return rgbToHex(r, g, b)
  }
}

export const matplotlibColorCycle = new ColorCycle(matplotlibColors, 'hex')
