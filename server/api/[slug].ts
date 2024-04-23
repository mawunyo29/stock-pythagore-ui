interface ProductDto {
    id: number;
    label: string;
    qty: number;
    ref: string;
    fintion:{
        id: number;
        label: string;
    },
    category:{
        id: number;
        label: string;
    }, 
}
export default defineEventHandler(async(event) => {
//   const evntQuery = getQuery(event)
//   const baseURL = useRuntimeConfig().public.baseURL
//   console.log(evntQuery , 'evntQuery', baseURL, 'baseURL');
  
//   const dataDto = await $fetch(`${baseURL}/api/stock/products`, {
//       method: 'GET',
//       query: evntQuery
//       }) as any
//   console.log(dataDto, 'dataDto');
// return  dataDto.data 
}
)
