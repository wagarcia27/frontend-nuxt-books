<template>
  <section class="card" style="max-width:520px; margin: 0 auto;">
    <h2 style="margin-top:0;">Autenticación</h2>
    <p class="muted">Esta SPA usa autenticación Basic en el backend. Configura las variables en <code>.env</code> del Front y recarga:</p>
    <pre class="card" style="overflow:auto;">
NUXT_PUBLIC_API_BASE=http://localhost:3000/api
NUXT_PUBLIC_BASIC_USER=admin
NUXT_PUBLIC_BASIC_PASS=admin
    </pre>
    <NuxtLink class="btn" to="/">Ir al inicio</NuxtLink>
  </section>
  
</template>

<script setup lang="ts">
// Pantalla informativa; no se usa login en el Front
</script>

