import Axios from 'axios'

export const API_KEY = process.env.VUE_APP_BMA_API_KEY || ''
export const BMA_URL = process.env.VUE_APP_BMA_URL || ''
export const defaultTimeout = 15000

export const api = Axios.create({
  baseURL: BMA_URL,
  headers: {
    Authorization: `Api-Key ${API_KEY}`,
  },
})
