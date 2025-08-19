# Book Reviews – Frontend (Nuxt 3 + Pinia + Sass)

SPA para gestionar búsquedas y reseñas de libros, con autenticación Basic contra un backend Node.js/MongoDB Atlas. El objetivo es cumplir el requerimiento técnico y ofrecer una UX clara y moderna.

## Requisitos

- Node.js 18.x (obligatorio)
- npm 9.x o superior
- Backend activo con base URL `http://localhost:3000/api` (ajustable por `.env`)

## Configuración rápida

1) Instalar dependencias
```bash
npm install
```
2) Variables de entorno (crear `.env` en la raíz):
```env
NUXT_PUBLIC_API_BASE=http://localhost:3000/api
```
3) Ejecutar en desarrollo
```bash
npm run dev
```
4) Compilar y previsualizar producción
```bash
npm run build
npm run preview
```

## Funcionalidades principales

- Autenticación con Basic (Login/Register/WhoAmI). Sesión persistida en el front mediante token Basic.
- Home con buscador, últimas 5 búsquedas (por usuario) y resultados (máx. 10).
- Detalle de libro: portada, título, autor y año; reseña (máx. 500) y calificación (1–5).
- “Mi biblioteca”: listados con filtros (título, autor, solo con review) y orden por calificación (asc/desc), todo por usuario.
- Portadas servidas por el backend (base64 o endpoint público) con manejo de casos relativos/absolutos.
- Toasters de confirmación (guardar/actualizar/eliminar, logout) y diálogo de confirmación para eliminar.

## Estructura del proyecto

```
Frontend/
├─ assets/styles/main.scss       # Estilos globales (Sass, sin frameworks de UI)
├─ components/                   # UI reutilizable: Header, Cards, Dialogs, Toast, Rating…
│  ├─ AppHeader.vue
│  ├─ BookCard.vue
│  ├─ ConfirmDialog.vue
│  ├─ ConfirmToast.vue
│  ├─ SearchBar.vue
│  └─ StarRating.vue
├─ composables/                  # Integraciones auxiliares
│  ├─ useApi.ts                  # Base URL + headers (Basic) + helpers
│  ├─ useOpenLibrary.ts          # Fallback de datos de OpenLibrary
│  └─ useLocalLibrary.ts         # (No se usa para persistencia real; quedó para pruebas)
├─ middleware/
│  └─ auth.global.ts             # Protege rutas (todas salvo /login) y valida whoAmI
├─ pages/                        # Vistas
│  ├─ index.vue                  # Home: buscador + últimas búsquedas + resultados
│  ├─ login.vue                  # Login/Register con tabs
│  ├─ library.vue                # Biblioteca con filtros y orden
│  └─ book/[id].vue              # Detalle + guardar/editar reseña/calificación
├─ stores/                       # Pinia stores (estado de la app)
│  ├─ auth.ts                    # login/register/whoAmI/logout
│  ├─ search.ts                  # búsqueda y últimas búsquedas
│  └─ library.ts                 # CRUD de mi biblioteca
├─ app.vue                       # Shell + validación de sesión al montar (whoAmI)
├─ nuxt.config.ts                # Configuración (Pinia, Sass, runtimeConfig)
└─ package.json
```

## Integración con el Backend

Base URL configurable por `.env`: `NUXT_PUBLIC_API_BASE`.

### Autenticación (Basic)
- `POST /auth/register` { username, password }
- `GET /auth/login` (requiere header `Authorization: Basic …`)
- `GET /auth/whoami` (requiere header `Authorization: Basic …`)
- `POST /auth/logout` (lógico; el front elimina el token)

El front genera `Basic ${btoa(username:password)}` y lo persiste (token) para reusar entre recargas. No se almacena el password en el front.

### Búsqueda/Últimas búsquedas
- `GET /books/search?q=term` → máx 10 docs, con `{ id, title, author, publishYear, coverUrl, saved, savedId }`; `saved`/`savedId` son por usuario.
- `GET /books/last-search` → últimas 5 del usuario autenticado.

### Mi biblioteca (por usuario)
- `POST /books/my-library` → guarda `{ title, author, openLibraryWorkKey, coverId?, rating?, review? }` y vincula el `username` del token.
- `GET /books/my-library` → filtros: `q`, `author`, `hasReview=true`, `sort=rating:asc|desc`; solo devuelve libros del usuario.
- `GET /books/my-library/:id` → ownership; 404 si el libro no es del usuario.
- `PUT /books/my-library/:id` → actualiza `{ rating, review }` (ownership).
- `DELETE /books/my-library/:id` → elimina (ownership).
- `GET /books/front-cover/:id` → imagen pública (el front normaliza rutas relativas/absolutas y usa base64 si llega en payload).

## UX/Flujos

- Login/Register con tabs; después de registrarse no se auto loguea: cambia a la pestaña de login para ingresar.
- Logout fuerza navegación a `/login` y no permite volver con “atrás” (`replace: true`).
- Middleware protege todas las rutas salvo `/login` y valida sesión con `whoAmI` en cada navegación.
- Home muestra las últimas 5 búsquedas del usuario autenticado; resultados indican “Guardado” cuando ya pertenece a la biblioteca del usuario.

## Estilos y Accesibilidad

- Estilos creados con Sass en `assets/styles/main.scss`. No se usan temas completos.
- Componentes pensados con roles ARIA básicos (ej.: rating como radiogroup) y jerarquía semántica.

## Seguridad

- El front no guarda contraseñas; solo un token Basic (string) para reusar la sesión.
- Si prefieres no persistir nada localmente, se puede cambiar a “solo memoria” (el usuario debería iniciar sesión tras cada recarga). Indícalo y lo activo fácilmente.

## Cumplimiento del requerimiento

- Nuxt 3 + Node 18 ✔️
- Store con Pinia ✔️
- CSS con Sass desde cero (sin frameworks de UI completos) ✔️
- UI/UX a criterio con patrones modernos (cards, toasts, select custom, etc.) ✔️

## Problemas comunes / Solución

- 401 en `/auth/login` o `/whoami` → falta el header `Authorization: Basic …`. Verifica tus credenciales.
- 404 en `/books/front-cover/:id` → si llega `coverUrl` relativo, el front lo resuelve a absoluto; también se usa `coverImageBase64` si está disponible.
- 404 al abrir detalle con ID que no es de Mongo → el front ya evita consultar `/books/my-library/:id` cuando el ID no tiene formato ObjectId (reduce 404 “inútiles”).

## Roadmap corto

- Botón “Ver en biblioteca” en resultados cuando `saved=true`.
- Persistencia opcional del token en memoria (no localStorage) a pedido de seguridad.
- Tests E2E básicos (Playwright) y unit tests de stores.

---

Hecho con 💙 en Nuxt 3, cuidando la UX y con integración estricta al backend para asegurar que cada usuario vea su propia información.
