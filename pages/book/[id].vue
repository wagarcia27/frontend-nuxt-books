<template>
  <section v-if="book">
    <BookCard :title="book.title" :author="book.author" :year="book.year" :cover="coverSrc" :largeCover="true">
      <form class="card review-card" @submit.prevent="save">
        <div class="row between">
          <h4 style="margin:0;">Agregar a "mi biblioteca"</h4>
          <span class="muted">ID: {{ id }}</span>
        </div>
        <div class="spacer" />
        <StarRating v-model="rating" />
        <div class="spacer" />
        <div class="textarea-wrap">
          <textarea v-model="review" maxlength="500" placeholder="Escribe un pequeño review (máx 500 caracteres)" />
          <span class="char-counter">{{ review.length }}/500</span>
        </div>
        <div class="spacer" />
        <div class="row between">
          <button class="btn">Guardar</button>
          <NuxtLink class="btn secondary" to="/">Volver</NuxtLink>
        </div>
      </form>
    </BookCard>
  </section>
  <p v-else class="muted">Cargando…</p>
  <ConfirmToast v-model="showToast" message="Guardado con éxito" />
</template>

<script setup lang="ts">
const route = useRoute()
const id = route.params.id as string
const search = useSearchStore()
const library = useLibraryStore()
const auth = useAuthStore()

const open = useOpenLibrary()
const book = ref<any>(null)
const existingLibraryId = ref<string | null>(null)
const rating = ref<number>(0)
const review = ref('')
const showToast = ref(false)
const api = useApi()

onMounted(async () => {
  // Solo consultar la biblioteca si el id parece un ObjectId válido.
  const isMongoId = /^[a-f0-9]{24}$/i.test(id)
  if (isMongoId) {
    const existing = await useLibraryStore().getById(id)
    if (existing) {
      existingLibraryId.value = id
      book.value = existing
      if ((existing as any).review) {
        review.value = (existing as any).review
        rating.value = Number((existing as any).rating || 0)
      }
      return
    }
  }
  // Si venimos desde resultados, úsalo; si no, trae por work id desde OpenLibrary
  const fromList = search.results.find(r => r.id === id)
  if (fromList) { book.value = fromList; return }
  book.value = await open.getWorkById(id)
})

const extractCoverId = (url?: string) => {
  if (!url) return undefined
  const m = url.match(/\/b\/id\/(\d+)-/)
  return m ? Number(m[1]) : undefined
}

const coverSrc = computed(() => {
  const b = book.value
  if (!b) return ''
  if (b.coverImageBase64) return `data:image/jpeg;base64,${b.coverImageBase64}`
  const url: string | undefined = b.coverUrl
  if (!url) return ''
  if (url.startsWith('/api/books/front-cover/')) {
    const cid = url.split('/').pop() as string
    return api.libraryCoverUrl(cid)
  }
  if (url.startsWith('/books/front-cover/')) {
    const cid = url.split('/').pop() as string
    return api.libraryCoverUrl(cid)
  }
  return url
})

const save = async () => {
  if (!book.value) return
  if (existingLibraryId.value) {
    const updated = await library.update(existingLibraryId.value, { review: review.value, rating: rating.value })
    if (updated) { showToast.value = true; setTimeout(() => navigateTo('/library?msg=actualizado', { replace: true }), 1200) }
    return
  }
  // Nuevo registro en mi biblioteca
  const workId = book.value.id || id
  const payload = {
    title: book.value.title,
    author: book.value.author,
    openLibraryWorkKey: workId.startsWith('/works/') ? workId : `/works/${workId}`,
    coverId: extractCoverId(book.value.coverUrl),
    rating: rating.value,
    review: review.value
  }
  const saved = await library.save(payload as any)
  if (saved && (saved as any)._id) { showToast.value = true; setTimeout(() => navigateTo('/library?msg=guardado', { replace: true }), 1200) }
}
</script>

<style scoped>
.review-card { display: grid; gap: 12px; }
/* Portada grande, sin recortes y con marco para que se vea nítida */
.review-card :deep(img.cover) {
  width: 240px; /* mayor presencia */
  height: auto;
  object-fit: contain; /* no recorta */
  background: #0b1220;
  padding: 6px;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  box-shadow: 0 10px 22px rgba(0,0,0,0.35);
}
.textarea-wrap { position: relative; }
.textarea-wrap .char-counter { position: absolute; right: 10px; bottom: 8px; font-size: 12px; color: var(--muted); }
@media (min-width: 1200px) {
  .review-card :deep(img.cover) { width: 280px; }
}
</style>

