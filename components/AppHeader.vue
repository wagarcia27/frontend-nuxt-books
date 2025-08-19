<template>
  <header class="app-header">
    <div class="container row between" style="padding: 12px 16px;">
      <NuxtLink class="brand" to="/">📚 {{ appName }}</NuxtLink>
      <nav class="row">
        <NuxtLink to="/">Inicio</NuxtLink>
        <NuxtLink to="/library">Mi biblioteca</NuxtLink>
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
</script>

