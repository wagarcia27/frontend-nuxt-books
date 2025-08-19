import { defineStore } from 'pinia'

interface AuthState {
  token: string | null
  userName: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: process.client ? localStorage.getItem('br_token') : null,
    userName: process.client ? localStorage.getItem('br_user') : null,
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.token)
  },
  actions: {
    async login(username: string, password: string) {
      const basic = btoa(`${username}:${password}`)
      const config = useRuntimeConfig()
      const baseURL = (config.public as any).apiBase
      try {
        await $fetch('/auth/login', {
          baseURL,
          headers: { Authorization: `Basic ${basic}` }
        })
        this.token = basic
        this.userName = username
        if (process.client) {
          localStorage.setItem('br_token', basic)
          localStorage.setItem('br_user', username)
        }
        return true
      } catch (e) {
        return false
      }
    },
    async whoAmI() {
      if (!this.token) return null
      const baseURL = (useRuntimeConfig().public as any).apiBase
      try {
        const data = await $fetch('/auth/whoami', {
          baseURL,
          headers: { Authorization: `Basic ${this.token}` }
        })
        return data
      } catch { return null }
    },
    async register(username: string, password: string) {
      const baseURL = (useRuntimeConfig().public as any).apiBase
      await $fetch('/auth/register', {
        baseURL,
        method: 'POST',
        body: { username, password },
        headers: { 'Content-Type': 'application/json' }
      })
    },
    logout() {
      this.token = null
      this.userName = null
      if (process.client) {
        localStorage.removeItem('br_token')
        localStorage.removeItem('br_user')
      }
      // Forzar navegación inmediata a login y evitar volver con back
      navigateTo('/login?msg=logout', { replace: true })
    }
  }
})


