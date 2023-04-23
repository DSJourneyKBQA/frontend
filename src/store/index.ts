import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
  state: () => ({
    token: '',
    uid: 0,
    login: false,
    isAdmin: false,
    navTheme: 'light',
    setting: {
      legacyEditor: false,
      stickyTextarea: false,
      autoAlign: false,
    },
  }),
  getters: {
    isMainPage() {
      const route = useRoute()
      return route.name === 'home'
    },
  },
})
