import { createApp } from 'vue'
import { Icon } from '@iconify/vue'
import { createPinia } from 'pinia'
import VCalendar from 'v-calendar'
import 'v-calendar/style.css'
import './api/db.js'
import './style.css'
import App from './App.vue'
import 'vue-toast-notification/dist/theme-default.css'
const app = createApp(App)
const pinia = createPinia()

app.component('Icon', Icon)
app.use(VCalendar, {})
app.use(pinia)
app.mount('#app')
