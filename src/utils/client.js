import Axios from 'axios'

export const API_KEY = process.env.VUE_APP_BMA_API_KEY || ''
export const ACCESS_TOKEN = process.env.VUE_APP_BMA_ACCESS_TOKEN || ''
export const BMA_URL = process.env.VUE_APP_BMA_URL || ''
const defaultTimeout = 15000

const client = Axios.create({
  baseURL: `${BMA_URL}/api/v1/`,
  headers: {
    Authorization: `Api-Key ${API_KEY}`,
  },
  timeout: defaultTimeout,
})

export const BaseApiKeyClient = Axios.create({
  baseURL: BMA_URL,
  headers: {
    Authorization: `Api-Key ${API_KEY}`,
  },
  timeout: defaultTimeout,
})

export const BaseOauth2Client = Axios.create({
  baseURL: BMA_URL,
  headers: {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
  },
  timeout: defaultTimeout,
})

export const ApiKeyBasedClient = Axios.create({
  headers: {
    Authorization: `Api-Key ${API_KEY}`,
  },
  timeout: defaultTimeout,
})

export const OAuth2BasedClient = Axios.create({
  headers: {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
  },
  timeout: defaultTimeout,
})

export default client
