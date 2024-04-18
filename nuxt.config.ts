// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Enable devtools based on environment variable
  devtools: { enabled: process.env.ENABLE_DEV_TOOLS === 'true' },
  
  // Define the path for components
  components:[
    { path: '~/components', pathPrefix:false},
  ],
  
  // Transpile specific dependencies
  // build: {
  //   transpile: [/pinia/],
  // },
  
  // // Add global CSS
  // css: [
  //   '~/assets/css/main.css'
  // ],
  
  // Define runtime configuration
  runtimeConfig: {
    public:{
      baseURL: process.env.BASE_API_URL || 'http://localhost:3000',
      secretKey: process.env.SECRET_KEY,
    }
  },
  
  // Enable server side rendering based on environment variable
  ssr: process.env.ENABLE_SSR === 'true',
  
  // Define dependencies to be optimized by Vite
  vite: {
    optimizeDeps: {
      include: [
        'mermaid',
      ]
    }
  },
  
  // Define Nitro route rules
  nitro: {
    routeRules: {
      "/": { prerender: true },
      "/backend/**": {
        proxy: `${process.env.BASE_API_URL}/**`
      },
    }
  },
  
  // Define Nuxt modules
  modules: ['@element-plus/nuxt', '@nuxt/ui', '@pinia/nuxt', '@vueuse/nuxt','dayjs-nuxt']
})