export interface OpenLibResultItem {
  id: string
  title: string
  author: string
  year?: number
  coverUrl?: string
}

const coverFromId = (coverId?: number) => coverId ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` : undefined

export const useOpenLibrary = () => {
  const searchByTitle = async (q: string): Promise<OpenLibResultItem[]> => {
    const url = 'https://openlibrary.org/search.json'
    const data: any = await $fetch(url, { params: { title: q, limit: 20 } })
    const docs = Array.isArray(data?.docs) ? data.docs : []
    return docs.map((d: any) => ({
      id: String(d.key || d.cover_edition_key || d.seed?.[0] || Math.random()).replace('/works/', ''),
      title: d.title,
      author: Array.isArray(d.author_name) ? d.author_name[0] : (d.author_name || 'Desconocido'),
      year: d.first_publish_year,
      coverUrl: coverFromId(d.cover_i)
    }))
  }

  const getWorkById = async (id: string): Promise<OpenLibResultItem | null> => {
    try {
      const work: any = await $fetch(`https://openlibrary.org/works/${id}.json`)
      const title = work?.title
      const year = Array.isArray(work?.created) ? undefined : (work?.created?.value ? new Date(work.created.value).getFullYear() : undefined)
      let author = 'Desconocido'
      const authorKey = work?.authors?.[0]?.author?.key
      if (authorKey) {
        const a: any = await $fetch(`https://openlibrary.org${authorKey}.json`)
        author = a?.name || author
      }
      const covers = work?.covers
      const coverUrl = Array.isArray(covers) && covers.length ? coverFromId(covers[0]) : undefined
      return { id, title, author, year, coverUrl }
    } catch {
      return null
    }
  }

  return { searchByTitle, getWorkById }
}



