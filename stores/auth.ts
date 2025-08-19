import { defineStore } from 'pinia'

interface AuthState {
  token: string | null
  userName: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: null,
    userName: null,
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.token)
  },
  actions: {
    // Mantener store para posible futuro
  }
})


