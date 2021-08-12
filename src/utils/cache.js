export default class Cache {
  constructor() {
    this.internalStorage = {}
  }

  get(key) {
    return this.internalStorage[key]
  }

  set(key, data) {
    this.internalStorage[key] = data
  }

  hasData(key) {
    return Object.prototype.hasOwnProperty.call(this.internalStorage, key)
  }

  remove(key) {
    delete this.internalStorage[key]
  }
}
