import { createPinia } from 'pinia'
import toast from 'vue-toastification'
import App from '@/App.vue'
import router from '@/router'

import '@/assets/tailwind.css'
import 'nprogress/nprogress.css'
import 'vue-toastification/dist/index.css'
import 'highlight.js/styles/github-dark.css'

const app = createApp(App)

app.use(router)
app.use(createPinia())
app.use(toast)

app.mount('#app')
