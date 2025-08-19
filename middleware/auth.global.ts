export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore()

  // Permitir la página de login siempre
  if (to.path === '/login') {
    // Si ya está autenticado, opcionalmente redirigir al home
    if (auth.isAuthenticated) return
    return
  }

  // Proteger todas las rutas restantes
  if (!auth.isAuthenticated) {
    return navigateTo('/login')
  }

  // Validar sesión contra el backend (por si el token expiró o es inválido)
  const who = await auth.whoAmI()
  if (!who) {
    auth.logout()
    return navigateTo('/login')
  }
})
