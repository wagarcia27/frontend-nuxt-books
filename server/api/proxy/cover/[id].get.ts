// Ya no se usa porque el backend devuelve coverImageBase64 en los listados.
export default defineEventHandler(() => {
  setResponseStatus(event, 410)
  return 'Gone'
})


