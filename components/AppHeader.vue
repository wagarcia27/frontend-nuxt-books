<template>
  <header class="app-header">
    <div class="container row between" style="padding: 12px 16px;">
      <NuxtLink class="brand" to="/">📚 {{ appName }}</NuxtLink>
      <nav class="row header-nav">
        <NuxtLink to="/">Inicio</NuxtLink>
        <NuxtLink to="/library">Mi biblioteca</NuxtLink>
        <div v-if="auth.isAuthenticated" class="row auth-box" style="gap:8px; align-items:center;">
          <span class="muted">{{ auth.userName }}</span>
          <button class="btn secondary" @click="auth.logout()">Logout</button>
        </div>
        <NuxtLink v-else class="btn secondary" to="/login">Login</NuxtLink>
      </nav>
    </div>
  </header>
  <div class="spacer" />
  <div class="spacer" />
  <div class="spacer" />
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const appName = config.public.appName
const auth = useAuthStore()
</script>

<style scoped>
.header-nav { width: 100%; display: flex; gap: 16px; align-items: center; }
.auth-box { margin-left: auto; }
@media (max-width: 640px) {
  .header-nav { justify-content: space-between; }
}
</style>

