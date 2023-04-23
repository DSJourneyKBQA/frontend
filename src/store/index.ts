import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
  state: () => ({
    navTheme: 'light',
  }),
  getters: {
    isMainPage() {
      const route = useRoute()
      return route.name === 'home'
    },
  },
})
