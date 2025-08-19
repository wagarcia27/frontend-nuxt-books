<template>
  <div class="card" style="display:flex; gap:12px; align-items:flex-start; min-height:160px;">
    <img :src="cover" alt="portada" class="cover" loading="lazy" />
    <div style="flex:1;">
      <h3 class="card-title">{{ title }}</h3>
      <p v-if="showMeta" class="muted" style="margin:0 0 10px 0;">{{ author }}<span v-if="year"> · {{ year }}</span></p>
      <div style="display:flex; flex-direction:column; gap:10px;">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ title: string; author: string; year?: number; cover?: string; showMeta?: boolean }>(), {
  showMeta: true
})
const cover = computed(() => props.cover || 'https://placehold.co/96x144?text=Libro')
const { title, author, year, showMeta } = toRefs(props)
</script>

<style scoped>
.card-title { margin: 0 0 4px 0; color: var(--text); font-weight: 700; text-decoration: none; }
</style>

