<template>
  <header class="app-header">
    <div class="container header-grid">
      <NuxtLink class="brand" to="/">📚 {{ appName }}</NuxtLink>
      <nav class="row header-nav">
        <NuxtLink to="/">Inicio</NuxtLink>
        <NuxtLink to="/library">Mi biblioteca</NuxtLink>
        <div v-if="auth.isAuthenticated" class="row auth-box" style="gap:8px; align-items:center;">
          <div class="user-chip">
            <svg class="avatar" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true"><path fill-rule="evenodd" d="M12 2.25a4.5 4.5 0 0 0-3.182 7.682A8.252 8.252 0 0 0 3.75 17.25a.75.75 0 0 0 1.5 0 6.75 6.75 0 1 1 13.5 0 .75.75 0 0 0 1.5 0 8.252 8.252 0 0 0-5.068-7.318A4.5 4.5 0 0 0 12 2.25Zm0 1.5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z" clip-rule="evenodd"/></svg>
            <span class="name">{{ auth.userName }}</span>
          </div>
          <button class="btn secondary power" @click="auth.logout()">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true"><path fill-rule="evenodd" d="M11.47 3.97a.75.75 0 0 1 .53-.22h.003a.75.75 0 0 1 .53 1.28L12.53 6.47A6.75 6.75 0 1 1 5.25 12a.75.75 0 0 1 1.5 0 5.25 5.25 0 1 0 8.603 3.89l1.06 1.06a.75.75 0 0 1-1.06 1.06 7.5 7.5 0 1 1-2.88-12.04l-1.043-1.04a.75.75 0 0 1 0-1.06ZM16.5 12a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 0 1.5h-3A.75.75 0 0 1 16.5 12Z" clip-rule="evenodd"/></svg>
            Logout
          </button>
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
.header-grid { padding: 12px 16px; display: grid; grid-template-columns: 1fr auto; align-items: center; }
.header-nav { display: flex; gap: 16px; align-items: center; justify-content: flex-end; }
.auth-box { margin-left: auto; }
.user-chip { display: inline-flex; align-items: center; gap: 6px; padding: 6px 10px; border-radius: 999px; border:1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.03); }
.user-chip .avatar { filter: drop-shadow(0 2px 8px rgba(0,0,0,.35)); }
.user-chip .name { color: var(--text); font-weight: 600; }
.power { display: inline-flex; gap: 6px; align-items: center; }
@media (max-width: 640px) {
  .header-grid { grid-template-columns: 1fr auto; }
}
</style>

