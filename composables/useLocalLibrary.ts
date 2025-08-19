import type { LibraryBook } from '~/stores/library'

const KEY = 'br_library'
const LAST_KEY = 'br_last_queries'

export const useLocalLibrary = () => {
  const read = (): LibraryBook[] => {
    if (!process.client) return []
    try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
  }
  const write = (items: LibraryBook[]) => {
    if (!process.client) return
    localStorage.setItem(KEY, JSON.stringify(items))
  }
  const list = (filters?: { q?: string; author?: string; onlyReviewed?: boolean }): LibraryBook[] => {
    let items = read()
    if (filters?.q) items = items.filter(i => i.title.toLowerCase().includes(filters.q!.toLowerCase()))
    if (filters?.author) items = items.filter(i => i.author.toLowerCase().includes(filters.author!.toLowerCase()))
    if (filters?.onlyReviewed) items = items.filter(i => i.review && i.review.length)
    return items
  }
  const get = (id: string): LibraryBook | undefined => read().find(i => i.id === id)
  const save = (book: LibraryBook) => {
    const items = read()
    const idx = items.findIndex(i => i.id === book.id)
    if (idx >= 0) items[idx] = { ...items[idx], ...book }
    else items.unshift(book)
    write(items)
    return book
  }
  const update = (id: string, patch: Partial<LibraryBook>) => {
    const items = read()
    const idx = items.findIndex(i => i.id === id)
    if (idx >= 0) { items[idx] = { ...items[idx], ...patch }; write(items); return items[idx] }
    return undefined
  }
  const remove = (id: string) => { write(read().filter(i => i.id !== id)) }

  const lastQueries = () => {
    if (!process.client) return [] as string[]
    try { return JSON.parse(localStorage.getItem(LAST_KEY) || '[]') } catch { return [] }
  }
  const addLastQuery = (q: string) => {
    if (!process.client) return
    const prev = lastQueries().filter(x => x !== q)
    localStorage.setItem(LAST_KEY, JSON.stringify([q, ...prev].slice(0, 5)))
  }

  return { list, get, save, update, remove, lastQueries, addLastQuery }
}



