import Vue from 'vue'
import { ToastPlugin } from 'bootstrap-vue'
import App from './App'
import DisplayDevicePlugins from './plugins'
import ProgressBar from './components/progressbar'
import router from './router'
import store from './store'
import './registerServiceWorker'

import { NAMESPACE as PAGE_LOADER_NAMESPACE } from './store/loader'
import { SHOW_PAGE_LOADER, HIDE_PAGE_LOADER } from './store/loader/actions'

import { NAMESPACE as USER_NAMESPACE } from './store/user'
import { GET_CSRF_TOKEN, UPDATE_USER_DATA } from './store/user/actions'

Vue.config.productionTip = false
Vue.prototype.$baseUrl = process.env.BASE_URL

Vue.use(DisplayDevicePlugins)
Vue.use(ProgressBar)
Vue.use(ToastPlugin)

const initApp = () => {
  new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount('#app')
}

// Show initial page loader.
store.dispatch(PAGE_LOADER_NAMESPACE + '/' + SHOW_PAGE_LOADER)

window.addEventListener('load', () => {
  ;(async () => {
    // Get authenticated user.
    store
      .dispatch(USER_NAMESPACE + '/' + UPDATE_USER_DATA)
      .then((_user) => {
        initApp()
        store.dispatch(USER_NAMESPACE + '/' + GET_CSRF_TOKEN)
      })
      .catch((_error) => {
        if (
          process.env.NODE_ENV === 'production' ||
          process.env.NODE_ENV === 'staging'
        ) {
          return (window.location.href = process.env.VUE_APP_CENDANA_URL || '/')
        } else {
          // Skip authentication on local development.
          initApp()
        }
      })
      .finally(() => {
        store.dispatch(PAGE_LOADER_NAMESPACE + '/' + HIDE_PAGE_LOADER)
      })
  })()
})
