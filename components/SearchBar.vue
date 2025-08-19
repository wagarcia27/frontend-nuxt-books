<template>
  <form @submit.prevent="onSearch" class="row" style="gap: 8px;">
    <input
      v-model="q"
      class="input"
      :placeholder="placeholder"
      maxlength="120"
      aria-label="buscador"
      ref="inputRef"
    />
    <button class="btn" :disabled="loading">Buscar</button>
    <button v-if="q" class="btn secondary" type="button" @click="clear">Limpiar</button>
  </form>
</template>

<script setup lang="ts">
const props = defineProps<{ placeholder?: string; loading?: boolean; debounceMs?: number }>()
const emit = defineEmits<{ search: [query: string] }>()
const q = ref('')
const inputRef = ref<HTMLInputElement | null>(null)
onMounted(() => inputRef.value?.focus())
const onSearch = () => emit('search', q.value.trim())
const clear = () => { q.value = ''; inputRef.value?.focus() }

// búsquedas solo bajo submit: se desactiva debounce
</script>

