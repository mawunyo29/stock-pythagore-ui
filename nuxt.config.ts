// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Enable devtools based on environment variable
  devtools: {enabled: true},
  
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
  ssr: true,
  
  // Define dependencies to be optimized by Vite
  vite: {
    optimizeDeps: {
      include: [
        'mermaid',
      ]
    }
  },
 
  app: {
    // Define the default layout
    
    head: {
     title: 'PYTHAGORE STOCK MANAGEMENT',
      meta:[
        {
          charset: 'utf-8'
        },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1'
        }
      ]
  },
  },
 
  // Define Nitro route rules
  
   nitro:{
    routeRules: {
      "/": { prerender: true },
      
      "/backend/**": {
        proxy: `${process.env.BASE_API_URL}/**`,
       
      },
      //redirects
      
    },
   },
  
  
  // Define Nuxt modules
  modules: ['@element-plus/nuxt', '@nuxt/ui', '@pinia/nuxt', '@vueuse/nuxt','dayjs-nuxt'],
  dayjs: {
    locales: ['en', 'fr'],
    plugins: ['relativeTime', 'utc', 'timezone' ,'weekOfYear','customParseFormat'],
    defaultLocale: 'fr',
    defaultTimezone: 'France/Paris',
  },
  ui: {
    notifications: {
      // Show toasts at the top right of the screen
      position: 'top-0 bottom-auto'
    }
  }

})
