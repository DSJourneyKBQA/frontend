import { createPinia } from 'pinia'
import toast, { POSITION } from 'vue-toastification'
import App from '@/App.vue'
import router from '@/router'

import '@/assets/style/tailwind.css'
import '@/assets/style/transition.css'

import 'nprogress/nprogress.css'
import 'vue-toastification/dist/index.css'
import 'highlight.js/styles/github-dark.css'

const app = createApp(App)

app.use(router)
app.use(createPinia())
app.use(toast, {
  position: POSITION.TOP_CENTER,
})

app.mount('#app')
