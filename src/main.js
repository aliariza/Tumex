import './assets/main.css'

import { createApp } from 'vue'
import VueLazyLoad from 'vue3-lazyload'
import App from './App.vue'
import router from './router'
import store from './store'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

const app = createApp(App)

app.use(VueLazyLoad, {
  loading: '',
  error: ''
})

app.use(store)
app.use(router)
app.use(Toast)

window.addEventListener('auth:unauthorized', async () => {
  store.dispatch('logout')

  if (router.currentRoute.value.matched.some((record) => record.meta.requiresAuth)) {
    await router.push('/iletisim/bayi')
  }
})

// Mount the app
app.mount('#app')
