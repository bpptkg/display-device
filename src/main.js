import Vue from 'vue'
import { ToastPlugin } from 'bootstrap-vue'
import App from './App'
import DisplayDevicePlugins from './plugins'
import ProgressBar from './components/progressbar'
import router from './router'
import store from './store'
import { UPDATE_USER } from './store/user/actions'

Vue.use(DisplayDevicePlugins)
Vue.use(ProgressBar)
Vue.use(ToastPlugin)

// // Get authenticated user.
// const USER_NAMESPACE = 'user'
// ;(async () => {
//   store.dispatch(USER_NAMESPACE + '/' + UPDATE_USER)
// })()

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
