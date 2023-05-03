import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
  state: () => ({
    token: '',
    uid: 0,
    login: false,
    isAdmin: false,
    navTheme: 'dark',
    setting: {
      legacyEditor: false,
      stickyTextarea: false,
      autoAlign: false,
    },
    pageLoading: false,
    likeCache: {
      POST: [] as string[],
      COMMENT: [] as string[],
    },
  }),
  getters: {
    isMainPage() {
      const route = useRoute()
      return route.name === 'home'
    },
  },
})
