import Fuse from 'fuse.js'
import searchIndex from './searchIndex'

const options = {
  includeScore: true,
  isCaseSensitive: false,
  keys: ['name'],
}

export default new Fuse(searchIndex, options)
