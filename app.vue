<template>
  <div id="app-root">
    <AppHeader />
    <main class="container">
      <NuxtPage />
    </main>
  </div>
  
</template>

<script setup lang="ts">
const auth = useAuthStore()
onMounted(() => {
  // Validar sesión si hay token guardado
  if (auth.token) auth.whoAmI()
})
</script>
