<template>
  <div class="empty">
    <div class="emoji">📚</div>
    <h3>{{ title }}</h3>
    <p class="muted">{{ subtitle }}</p>
    <div v-if="$slots.default" class="row" style="justify-content:center; margin-top:12px; gap:8px;">
      <slot />
    </div>
  </div>
  
</template>

<script setup lang="ts">
defineProps<{ title: string; subtitle: string }>()
</script>

<style scoped>
.empty { text-align: center; padding: 40px 0; }
.emoji { font-size: 42px; filter: drop-shadow(0 4px 18px rgba(0,0,0,0.35)); margin-bottom: 8px; }
h3 { margin: 6px 0; }
</style>


