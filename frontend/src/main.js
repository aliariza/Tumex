import './assets/main.css'

import { createApp } from 'vue'
import VueLazyLoad from 'vue3-lazyload'
import App from './app/App.vue'
import { inject } from '@vercel/analytics'
import router from './app/router'
import store from './app/store'
import { isRestrictedRoute } from './services/authAccess'

const app = createApp(App)

app.use(VueLazyLoad, {
  loading: '',
  error: ''
})

app.use(store)
app.use(router)

window.addEventListener('auth:unauthorized', async () => {
  store.dispatch('logout')

  if (router.currentRoute.value.matched.some((record) => isRestrictedRoute(record))) {
    await router.push('/iletisim/bayi')
  }
})

// Mount the app
app.mount('#app')

inject()