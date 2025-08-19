<template>
  <div class="tile">
    <img :src="cover" alt="portada" class="cover" loading="lazy" />
    <div class="title" :title="title">{{ title }}</div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ title: string; cover?: string }>()
const cover = computed(() => props.cover || 'https://placehold.co/160x240?text=Libro')
</script>

<style scoped>
.tile { display: grid; gap: 10px; text-decoration: none; }
.cover {
  width: 100%; aspect-ratio: 2/3; object-fit: cover; border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow: 0 10px 22px rgba(0,0,0,0.35);
  transition: transform .2s ease, box-shadow .2s ease;
  display: block;
}
.tile:hover .cover { transform: translateY(-2px); box-shadow: 0 14px 28px rgba(0,0,0,0.45); }
.title { font-weight: 600; line-height: 1.2; color: var(--text); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
</style>


