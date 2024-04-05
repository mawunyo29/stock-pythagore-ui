<style scoped></style>
<template>
  <div>
    <div class="container mx-auto my-8 h-full">
      <h1 class="sm:text-2xl text-center uppercase py-4">
        Liste de tous les produits {{ search }}
      </h1>
      <div class="flex items-center max-w-lg mx-auto my-4">
        <label for="voice-search" class="sr-only">Search</label>
        <div class="relative w-full">
          <div
            class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"
          >
            <svg
              class="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 21 21"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11.15 5.6h.01m3.337 1.913h.01m-6.979 0h.01M5.541 11h.01M15 15h2.706a1.957 1.957 0 0 0 1.883-1.325A9 9 0 1 0 2.043 11.89 9.1 9.1 0 0 0 7.2 19.1a8.62 8.62 0 0 0 3.769.9A2.013 2.013 0 0 0 13 18v-.857A2.034 2.034 0 0 1 15 15Z"
              />
            </svg>
          </div>
          <form>
            <input
              type="text"
              id="voice-search"
              v-model="search"
              @input="refreshData()"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search Mockups, Logos, Design Templates..."
              required
            />
          </form>
          <button
            type="button"
            class="absolute inset-y-0 end-0 flex items-center pe-3"
          >
            <svg
              class="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 16 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 7v3a5.006 5.006 0 0 1-5 5H6a5.006 5.006 0 0 1-5-5V7m7 9v3m-3 0h6M7 1h2a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V4a3 3 0 0 1 3-3Z"
              />
            </svg>
          </button>
        </div>
        <!-- <button type="submit" class="inline-flex items-center py-2.5 px-3 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        <svg class="w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
        </svg>Search
    </button> -->
      </div>
    </div>
    <div class="overflow-x-auto">
      <div class="inline-block min-w-full align-middle">
        <div class="overflow-hidden shadow-md sm:rounded-lg mx-4">
          <table
            class="w-full divide-y divide-gray-200 table-fixed text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
          >
            <thead
              class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
            >
              <tr>
                <th scope="col" class="px-6 py-3">Réf</th>
                <th scope="col" class="px-6 py-3">Label</th>
                <th scope="col" class="px-6 py-3">Category</th>
                <th scope="col" class="px-6 py-3">Qauntité</th>
                <th scope="col" class="px-6 py-3">finition</th>
              </tr>
            </thead>
            <tbody>
              <tr
                class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                v-for="(product, index) in filterData"
                :key="product.id"
              >
                <th
                  scope="row"
                  class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-xs"
                >
                  {{ product.ref }}
                </th>
                <td class="px-6 py-4 text-xs">{{ product.label }}</td>

                <td class="px-6 py-4 text-xs">{{ product.category?.label }}</td>
                <td class="px-6 py-4 text-xs">{{ product.qty }}</td>
                <td class="px-6 py-4 text-xs">{{ product.finition?.label }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  title: "Products",
  auth: true,
  name: "list-products",
  alias: ["/products"],
  middleware: ["auth"],
  loading: true,
});

//search bar

const search = ref("");
const searchValue = computed(() => search.value);
const query = reactive({
  search: search.value,
});
const {
  pending,
  data: products,
  refresh,
  execute,
  error,
} = await useFetchApi(`/api/stock/products`, {
  method: "GET",
  query: query,
});
const tableData = computed({
  get: () => products.value,
  set: (value) => {
    products.value = value;
  },
});
watch(search, (value) => {
  query.search = value;
  tableData.value = products.value;
});
const refreshData = async () => {
  query.search = search.value;

  await execute();
};

console.log(products.value);
const filterData = computed(() =>
  tableData.value?.data.filter(
    (productData) =>
      !search.value ||
      productData.label.toLowerCase().includes(search.value.toLowerCase()) ||
      //transformation int to string
      (productData?.finition?.label
        .toLowerCase()
        .includes(search.value.toLowerCase()) &&
        productData?.category?.label
          .toLowerCase()
          .includes(search.value.toLowerCase())) ||
      productData.qty
        .toString()
        .toLowerCase()
        .includes(search.value.toLowerCase()) ||
      productData.id.toString().includes(search.value.toLowerCase()) ||
      productData?.thikness?.label
        .toLowerCase()
        .includes(search.value.toLowerCase())
  )
);
</script>
