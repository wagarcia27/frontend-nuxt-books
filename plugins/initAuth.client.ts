export default defineNuxtPlugin(() => {
  const auth = useAuthStore()
  auth.initFromStorage()
})


