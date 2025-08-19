<template>
  <header class="app-header">
    <div class="container row between" style="padding: 12px 16px;">
      <NuxtLink class="brand" to="/">📚 {{ appName }}</NuxtLink>
      <nav class="row header-nav">
        <NuxtLink to="/">Inicio</NuxtLink>
        <NuxtLink to="/library">Mi biblioteca</NuxtLink>
        <div v-if="auth.isAuthenticated" class="row auth-box" style="gap:8px; align-items:center;">
          <div class="user-chip">
            <span class="avatar">👤</span>
            <span class="name">{{ auth.userName }}</span>
          </div>
          <button class="btn secondary power" @click="auth.logout()">⏻ Logout</button>
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
.user-chip { display: inline-flex; align-items: center; gap: 6px; padding: 6px 10px; border-radius: 999px; border:1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.03); }
.user-chip .avatar { filter: drop-shadow(0 2px 8px rgba(0,0,0,.35)); }
.user-chip .name { color: var(--text); font-weight: 600; }
.power { display: inline-flex; gap: 6px; align-items: center; }
@media (max-width: 640px) {
  .header-nav { justify-content: space-between; }
}
</style>

