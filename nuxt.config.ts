// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  future: {
    compatibilityVersion: 4,
  },

  app: {
    head: {
      title: 'Hadith Gems — Treasures of Prophetic Wisdom',
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1' },
        { name: 'description', content: 'Explore the treasures of Prophetic wisdom with word-by-word Hadith sciences, translations, morphology, and explanations across multiple languages.' },
        { name: 'theme-color', content: '#064E3B' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  css: ['~/assets/css/main.css'],

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/google-fonts',
  ],

  googleFonts: {
    families: {
      'Inter': [300, 400, 500, 600, 700],
      'Outfit': [400, 500, 600, 700, 800],
      'Amiri': [400, 700],
      'Scheherazade New': [400, 700],
    },
    display: 'swap',
    prefetch: true,
    preload: true,
  },

  runtimeConfig: {
    adminUsername: process.env.ADMIN_USERNAME || 'admin',
    adminPassword: process.env.ADMIN_PASSWORD || 'hadithgems2025',
    adminSecret: process.env.ADMIN_SECRET || 'hg-secret-key-change-in-production',
  },

  nitro: {
    experimental: {
      asyncContext: true,
    },
  },
})
