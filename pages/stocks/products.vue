<!-- <script  setup>
definePageMeta({
  title: "Products",
  auth: true,
  name: "list-products",
  alias:["/products"],
  middleware: ["auth"],
  loading: true
});

const allProducts = shallowRef([]);
const { pending, data: products } = await useLazyAsyncData('products', () => useFetchApi('/api/stock/products'))
// const products = ref([]);
// const pending = ref(true);

// const getProducts = async () => {
//   try {
//     const { data } = await useFetchApi('/api/stock/products',
//       {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application'
//         }
//       });
//     products.value = data;
//   } catch (error) {
//     console.error(error);
//   }
//   // try {
//   //   const response = await $fetch('http://gateway-users.test/api/stock/products');
//   //   console.log(response);
//   // } catch (error) {
//   //   console.error(error);
//   // }
// };

watch(() => products.value, (value) => {
  allProducts.value = value.data;
  console.log('products', allProducts.value ,pending);
 
});

// onMounted(async() => {
//   getProducts()
// })
</script>

<template>
 <div>
  <h1>Products</h1>
  <div v-if="pending">Loading...</div>
  <div v-else>
    <ul>
      <li v-for="product in allProducts" :key="product.id">
        {{ product. }}
      </li>
    </ul>
  </div>
 </div>
</template>

<style scoped></style> -->
<template>
  <div >
    <div class="container mx-auto my-8 h-full">
      <h1 class="sm:text-2xl text-center uppercase py-4">Liste de tous les produits</h1>

      <div class="flex items-center max-w-lg mx-auto my-4">
        <label for="voice-search" class="sr-only">Search</label>
        <div class="relative w-full">
          <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
              fill="none" viewBox="0 0 21 21">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M11.15 5.6h.01m3.337 1.913h.01m-6.979 0h.01M5.541 11h.01M15 15h2.706a1.957 1.957 0 0 0 1.883-1.325A9 9 0 1 0 2.043 11.89 9.1 9.1 0 0 0 7.2 19.1a8.62 8.62 0 0 0 3.769.9A2.013 2.013 0 0 0 13 18v-.857A2.034 2.034 0 0 1 15 15Z" />
            </svg>
          </div>
          <input type="text" id="voice-search" v-model="search"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search Mockups, Logos, Design Templates..." required />
          <button type="button" class="absolute inset-y-0 end-0 flex items-center pe-3">
            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 20">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 7v3a5.006 5.006 0 0 1-5 5H6a5.006 5.006 0 0 1-5-5V7m7 9v3m-3 0h6M7 1h2a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V4a3 3 0 0 1 3-3Z" />
            </svg>
          </button>
        </div>
        <!-- <button type="submit" class="inline-flex items-center py-2.5 px-3 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        <svg class="w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
        </svg>Search
    </button> -->
      </div>

      <el-table :data="filterData" border show-summary style="width: 100%" :max-height='700'>
        <el-table-column prop="id" label="ID" width="180" />
        <el-table-column prop="label" label="Label" />
        <el-table-column prop="qty" sortable label="Qantité" />
        <el-table-column prop="category.label" sortable label="Categorie" />
        <el-table-column prop="finition.label" sortable label="Finition" />
        <el-table-column prop="thikness.label" sortable label="Epaisseur" />
        <!-- <el-table-column prop="amount3" sortable label="Amount 3" /> -->
      </el-table>

      <!-- <el-table
      :data="tableData"
      border
      height="200"
      :summary-method="getSummaries"
      show-summary
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column prop="id" label="ID" width="180" />
      <el-table-column prop="label" label="Label" />
      <el-table-column prop="quantity" label="Quantité" />
      
    </el-table> -->
    </div>
  </div>

</template>

<script lang="ts" setup>
import type { TableColumnCtx } from 'element-plus'
definePageMeta({
  title: "Products",
  auth: true,
  name: "list-products",
  alias: ["/products"],
  middleware: ["auth"],
  loading: true
});

const { pending, data: products } = await useLazyAsyncData('products', () => useFetchApi('/api/stock/products'))

interface Product {
  id: string
  label: string
  quantity: number
}
//search bar
const search = ref('')

interface SummaryMethodProps<T = Product> {
  columns: TableColumnCtx<T>[]
  data: T[]
}

const getSummaries = (param: SummaryMethodProps) => {
  const { columns, data } = param
  const sums: string[] = []
  columns.forEach((column, index) => {
    if (index === 0 || index === 1) {
      sums[index] = 'Total qty: '
      return
    }
    const values = data.map((item) => Number(item[column.property]))
    if (!values.every((value) => Number.isNaN(value))) {
      sums[index] = ` ${values.reduce((prev, curr) => {
        const value = Number(curr)
        if (!Number.isNaN(value)) {
          return prev + curr
        } else {
          return prev
        }
      }, 0)}`
    } else {
      sums[index] = 'N/A'
    }
  })

  return sums
}

const tableData: Product[] = shallowRef([])
watch(() => products.value, (value) => {
  tableData.value = value.data;
  console.log('products', tableData.value, pending);
});
const filterData = computed(() =>
  tableData.value.filter(
    (data) =>
      !search.value ||
      data.label.toLowerCase().includes(search.value.toLowerCase())
      //transformation int to string
      || data?.finition?.label.toLowerCase().includes(search.value.toLowerCase())
      && data?.category?.label.toLowerCase().includes(search.value.toLowerCase())
      || data.qty.toString().toLowerCase().includes(search.value.toLowerCase())
      || data.id.toString().includes(search.value.toLowerCase())
      || data?.thikness?.label.toLowerCase().includes(search.value.toLowerCase())

  )
)
</script>
