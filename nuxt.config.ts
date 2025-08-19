// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt'
  ],
  css: ['~/assets/styles/main.scss'],
  runtimeConfig: {
    // Server-only
    mongodbUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bookreviews',
    basicUser: process.env.BASIC_USER || 'admin',
    basicPass: process.env.BASIC_PASS || 'admin123',
    public: {
      // Public runtime config
      appName: 'Book Reviews'
    }
  }
})
