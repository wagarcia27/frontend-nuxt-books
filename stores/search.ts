import { defineStore } from 'pinia'

export interface BookSearchItem {
  id: string
  title: string
  author: string
  year?: number
  coverUrl?: string
}

interface SearchState {
  lastQueries: string[]
  results: BookSearchItem[]
  isLoading: boolean
  error: string | null
}

export const useSearchStore = defineStore('search', {
  state: (): SearchState => ({
    lastQueries: [],
    results: [],
    isLoading: false,
    error: null
  }),
  actions: {
    async searchByTitle(query: string) {
      if (!query) return
      this.isLoading = true
      this.error = null
      try {
        const api = useApi()
        const res: any = await api.get('/books/search', { q: query })
        const raw: any[] = Array.isArray(res)
          ? res
          : (res?.results || res?.items || [])
        const normalizeCoverUrl = (u?: string): string | undefined => {
          if (!u) return undefined
          if (u.startsWith('http')) return u
          if (u.startsWith('/api/')) return `${api.baseURL}${u.slice(4)}`
          if (u.startsWith('/books/')) return `${api.baseURL}${u}`
          if (u.startsWith('/')) return `${api.baseURL}${u}`
          return u
        }
        const mapped = raw.map((r: any) => ({
          id: String(r.id || r.workId || r.openLibraryWorkKey || '').replace('/works/', ''),
          title: r.title,
          author: r.author,
          year: r.year || r.publishYear,
          coverUrl: normalizeCoverUrl(r.coverUrl)
        }))
        this.results = mapped
      } catch (e: any) {
        this.error = e?.message || 'Error en búsqueda'
      } finally {
        this.isLoading = false
      }
    },
    async loadLastQueries() {
      const api = useApi()
      try {
        const res: any = await api.get('/books/last-search')
        this.lastQueries = (res?.last || []).slice(0, 5)
      } catch (e: any) {
        // Silenciar el error si el backend aún no tiene datos o devuelve 500
        this.lastQueries = []
      }
    }
  }
})


