import type { UseFetchOptions } from 'nuxt/app'
export function useFetchApi<T>( path:string , options:UseFetchOptions<T> ={}) {
  let  headers:any = {}
 
  const token = useCookie('XSRF-TOKEN')
    if(token){
        headers = {
        'X-XSRF-TOKEN': token
        }
    }
    if(process.server){
       headers = {
        ...headers,
        ...useRequestHeaders(['referer' ,'cookie'])
        }
    }
    
    return useFetch(`/backend${path}`, {
      credentials: 'include',
      ...options,
      $fetch: useNuxtApp().$useFetchApi,
      watch:false,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
        ...options?.headers
      },
      
    })

}