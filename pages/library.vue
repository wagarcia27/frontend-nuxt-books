<template>
  <section>
    <div v-if="toast" class="card" style="background: rgba(34,197,94,0.12); border-color: rgba(34,197,94,0.35); margin-bottom:12px;">
      {{ toast }}
    </div>
    <div class="card">
      <div class="toolbar">
        <input v-model="filters.q" class="input" placeholder="Buscar por título" />
        <input v-model="filters.author" class="input" placeholder="Buscar por autor" />
        <label class="row" style="gap:8px;">
          <input type="checkbox" v-model="filters.onlyReviewed"> Solo con review
        </label>
        <select v-model="sortBy" class="input select-modern" style="width: 280px;">
          <option disabled value="">Ordenar por calificación</option>
          <option value="desc">Calificación: Descendente</option>
          <option value="asc">Calificación: Ascendente</option>
        </select>
        <button class="btn" @click="applySortAndFilters">Aplicar filtros</button>
        <button class="btn secondary" @click="clearFilters">Limpiar filtros</button>
      </div>
    </div>
    <div class="spacer-lg" />
    <div v-if="store.isLoading" class="muted">Cargando…</div>
    <div v-else-if="store.items.length" class="grid">
      <BookCard
        v-for="b in itemsSorted"
        :key="idFor(b)"
        :title="b.title"
        :author="b.author"
        :year="getYear(b)"
        :cover="coverFor(b)"
      >
        <p v-if="b.review" class="muted">{{ b.review }}</p>
        <div class="row between" style="margin-top:8px;">
          <div class="muted">Calificación: {{ b.rating || 0 }}/5</div>
          <div class="row" style="gap:8px;">
            <NuxtLink class="btn secondary" :to="`/book/${idFor(b)}`">Editar</NuxtLink>
            <button class="btn danger" @click="askRemove(b)">Eliminar</button>
          </div>
        </div>
      </BookCard>
    </div>
    <p v-else class="muted">No hay libros en tu biblioteca.</p>

    <ConfirmDialog
      v-model="showConfirm"
      title="Eliminar libro"
      :message="confirmMessage"
      confirm-text="Eliminar"
      cancel-text="Cancelar"
      @confirm="confirmRemove"
    />
    <ConfirmToast v-model="showToast" :message="toastMsg" />
  </section>
</template>

<script setup lang="ts">
const store = useLibraryStore()
const filters = reactive({ q: '', author: '', onlyReviewed: false })
const applySortAndFilters = () => store.fetchAll({ ...filters, sort: sortBy.value === 'asc' ? 'rating:asc' : 'rating:desc' })
const clearFilters = () => {
  filters.q = ''
  filters.author = ''
  filters.onlyReviewed = false
  sortBy.value = ''
  store.fetchAll(filters)
}
const api = useApi()
const coverFor = (b: any) => {
  if (b?.coverImageBase64) return `data:image/jpeg;base64,${b.coverImageBase64}`
  // Si el backend ya devuelve coverUrl relativa hacia /api/books/front-cover/:id, reescribir a proxy
  const url = b?.coverUrl as string | undefined
  if (url && url.startsWith('http')) return url
  const libId = b?.id || b?._id
  if (api.hasBackend && libId) return api.libraryCoverUrl(libId)
  return 'https://placehold.co/96x144?text=Libro'
}
onMounted(() => store.fetchAll(filters))
const showConfirm = ref(false)
const selected = ref<any>(null)
const askRemove = (b: any) => { selected.value = b; showConfirm.value = true }
const confirmMessage = computed(() => {
  const title = selected.value?.title || 'este libro'
  return `¿Seguro que deseas eliminar "${title}" de tu biblioteca?`
})
const confirmRemove = async () => {
  if (!selected.value) return
  await store.remove(idFor(selected.value))
  selected.value = null
  toastMsg.value = 'Libro eliminado con éxito'
  showToast.value = true
}
const route = useRoute()
const toast = computed(() => {
  const msg = route.query.msg as string | undefined
  if (!msg) return ''
  if (msg === 'guardado') return 'Libro guardado en tu biblioteca.'
  if (msg === 'actualizado') return 'Cambios guardados.'
  return ''
})
const idFor = (b: any) => b?.id || b?._id
const sortBy = ref<'' | 'asc' | 'desc'>('')
const itemsSorted = computed(() => store.items)
const showToast = ref(false)
const toastMsg = ref('')
const getYear = (b: any) => b?.year || b?.publishYear || b?.publishedYear || b?.firstPublishYear || undefined
</script>

