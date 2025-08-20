export default defineNuxtRouteMiddleware((to) => {
  // Permitir siempre la pantalla de login (respetando baseURL)
  if (to.path.endsWith('/login')) return

  // En SSR/generación, no decidir autenticación aún
  if (import.meta.server) return

  // Verificar token directamente desde localStorage para evitar condiciones de hidratación
  const token = localStorage.getItem('br_token')
  if (!token) {
    return navigateTo('/login')
  }
})
