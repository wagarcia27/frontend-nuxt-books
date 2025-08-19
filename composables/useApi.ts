export const useApi = () => {
  const config = useRuntimeConfig()
  const baseURL = (config.public as any).apiBase || ''
  const hasBackend = Boolean(baseURL)
  const auth = useAuthStore()

  const headers = () => {
    const h: Record<string, string> = {}
    if (auth.token) {
      h['Authorization'] = `Basic ${auth.token}`
    } else if ((config.public as any).basicUser && (config.public as any).basicPass) {
      const raw = `${(config.public as any).basicUser}:${(config.public as any).basicPass}`
      h['Authorization'] = `Basic ${btoa(raw)}`
    }
    return h
  }

  const get = async <T>(path: string, paramsOrOpts?: any) => {
    if (!hasBackend) throw new Error('Backend no configurado')
    const opts = (paramsOrOpts && typeof paramsOrOpts === 'object' && 'params' in paramsOrOpts)
      ? paramsOrOpts
      : { params: paramsOrOpts }
    return await $fetch<T>(path, { baseURL, headers: headers(), params: opts?.params })
  }
  const post = async <T>(path: string, body?: any) => {
    if (!hasBackend) throw new Error('Backend no configurado')
    return await $fetch<T>(path, { baseURL, method: 'POST', body, headers: headers() })
  }
  const put = async <T>(path: string, body?: any) => {
    if (!hasBackend) throw new Error('Backend no configurado')
    return await $fetch<T>(path, { baseURL, method: 'PUT', body, headers: headers() })
  }
  const del = async <T>(path: string) => {
    if (!hasBackend) throw new Error('Backend no configurado')
    return await $fetch<T>(path, { baseURL, method: 'DELETE', headers: headers() })
  }

  const libraryCoverUrl = (id: string, fallback?: string) => {
    if (!hasBackend) return fallback || ''
    return `${baseURL}/books/front-cover/${id}`
  }

  return { hasBackend, baseURL, get, post, put, del, libraryCoverUrl }
}


