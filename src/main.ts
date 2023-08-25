import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import SvgIcon from '@/components/SvgIcon/SvgIcon.vue'
import './assets/iconfont/iconfont.js'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
app.use(router).use(pinia)
app.component('SvgIcon', SvgIcon)
app.mount('#app')

import './permission'
