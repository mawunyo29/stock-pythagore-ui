// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  components:[
    { path: '~/components', pathPrefix:false},
  ],
  build: {
    transpile: [/pinia/],
  },
  css: [
    '~/assets/css/main.css'
  ],
  runtimeConfig: {
    // Will be available on both server and client
    public:{
      baseURL: process.env.BASE_API_URL || 'http://localhost:3000',
      // Will be only available on the server-side
      secretKey: process.env.SECRET_KEY,
    }
  },
  ssr: false,
  nitro: {
    routeRules: {
      "/": { prerender: true },
      "/backend/**": {
        proxy: `${process.env.BASE_API_URL}/**`
      },
    }
  },
  modules: [
    "@pinia/nuxt",
    "@vueuse/nuxt",
    "@nuxt/ui",
    "@element-plus/nuxt"
  ]
})