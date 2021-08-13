import Axios from 'axios'

const client = Axios.create({
  baseURL: process.env.VUE_APP_CENDANA_URL,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'X-CSRF-TOKEN': '', // TODO(indra): Implement CSRF token fetching.
  },
})

export default client
