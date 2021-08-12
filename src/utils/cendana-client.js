import Axios from 'axios'

const token = document.head.querySelector('meta[name="csrf-token"]')

if (!token) {
  console.error(
    'CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token'
  )
}

const client = Axios.create({
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'X-CSRF-TOKEN': '',
  },
})

export default client
