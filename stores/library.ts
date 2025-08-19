import { defineStore } from 'pinia'

export interface LibraryBook {
  id: string
  title: string
  author: string
  year?: number
  coverUrl?: string
  review?: string
  rating?: number
}

interface LibraryState {
  items: LibraryBook[]
  isLoading: boolean
  error: string | null
}

export const useLibraryStore = defineStore('library', {
  state: (): LibraryState => ({ items: [], isLoading: false, error: null }),
  actions: {
    async fetchAll(params?: { q?: string; author?: string; onlyReviewed?: boolean; sort?: string }) {
      this.isLoading = true
      this.error = null
      try {
        const api = useApi()
        // sanitizar y mapear nombres de parámetros según API
        const query: Record<string, any> = {}
        if (params?.q) query.q = params.q
        if (params?.author) query.author = params.author
        if (params?.onlyReviewed) query.hasReview = true
        if (params?.sort) query.sort = params.sort
        const res: any = await api.get('/books/my-library', query)
        this.items = Array.isArray(res) ? res : (res?.items || [])
      } catch (e: any) {
        this.error = e?.message || 'Error al cargar biblioteca'
      } finally { this.isLoading = false }
    },
    async getById(id: string) {
      const api = useApi()
      try {
        const res: any = await api.get(`/books/my-library/${id}`)
        return res?.item ?? res
      } catch (e) {
        // Si no existe en la biblioteca, devolvemos undefined en lugar de lanzar
        return undefined
      }
    },
    async save(book: LibraryBook) {
      const api = useApi()
      const res: any = await api.post('/books/my-library', book)
      return res?.item ?? res
    },
    async update(id: string, book: Partial<LibraryBook>) {
      const api = useApi()
      const res: any = await api.put(`/books/my-library/${id}`, book)
      return res?.item ?? res
    },
    async remove(id: string) {
      const api = useApi()
      await api.del(`/books/my-library/${id}`)
      await this.fetchAll()
    }
  }
})


