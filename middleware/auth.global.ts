export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()

  // Permitir siempre la pantalla de login (considerando baseURL)
  if (to.path.endsWith('/login')) return

  // Proteger rutas: si no hay token, redirigir a login
  if (!auth.isAuthenticated) {
    return navigateTo('/login')
  }
  // Nota: la validación con whoAmI se hace en app.vue de forma tolerante,
  // para evitar cerrar sesión por fallas transitorias de red/CORS.
})
