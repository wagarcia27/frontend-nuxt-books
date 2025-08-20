<template>
  <section v-if="isAuthed" v-cloak>
    <div class="card">
      <SearchBar
        :placeholder="'Escribe el nombre de un libro para continuar'"
        :loading="store.isLoading"
        @search="doSearch"
      />
      <div class="spacer" />
      <div v-if="store.lastQueries.length" class="toolbar">
        <span class="muted">Búsquedas recientes:</span>
        <button
          v-for="q in store.lastQueries"
          :key="q"
          class="tag"
          @click="doSearch(q)"
        >{{ q }}</button>
      </div>
    </div>

    <div class="spacer-lg" />
    <div v-if="store.isLoading && hasSearched">
      <div class="grid">
        <SkeletonCard v-for="i in 6" :key="i" />
      </div>
    </div>
    <div v-else-if="store.results.length" class="grid">
      <NuxtLink
        v-for="b in limited"
        :key="b.id"
        :to="`/book/${b.id}`"
      >
        <BookCard :title="b.title" :author="b.author" :year="undefined" :cover="b.coverUrl" :showMeta="false">
          <template #actions>
            <span v-if="b.saved" class="tag">Guardado</span>
          </template>
        </BookCard>
      </NuxtLink>
    </div>
    <EmptyState v-else-if="hasSearched" title="No encontramos libros con el título ingresado" subtitle="Intenta con otro título o revisa la ortografía.">
      <button v-for="q in store.lastQueries.slice(0,5)" :key="q" class="btn" @click="doSearch(q)">{{ q }}</button>
    </EmptyState>
  </section>
</template>

<script setup lang="ts">
const store = useSearchStore()
// Limpiar resultados residuales inmediatamente al entrar a Home
store.results = []
const hasSearched = ref(false)
const doSearch = (q: string) => { hasSearched.value = true; store.searchByTitle(q) }
const limited = computed(() => store.results.slice(0, 10))
const isAuthed = ref(false)
onMounted(async () => {
  isAuthed.value = Boolean(localStorage.getItem('br_token'))
  if (!isAuthed.value) {
    navigateTo('/login', { replace: true })
    return
  }
  // Evitar mostrar resultados previos de otra vista mientras cargamos home
  store.results = []
  await store.loadLastQueries()
  await store.loadHome()
})
</script>

