<script setup>
const stockCalandar = ref([]);
const weekToDisplay = ref(24);
const search = ref("");
let rest;
definePageMeta({
  title: "Stock",
  auth: true,
  name: "stock",
  alias: ["/stock"],
  middleware: ["auth"],
  loading: true,
});
const rotation = ref(3);
const rotationQuery = reactive({
  month: rotation.value,
});

const { data: rotations, refresh } = await useFetchApi(`/api/planning/rotations`, {
  method: "GET",
  query: rotationQuery,
});

watch(rotation, (value) => {
  rotationQuery.month = value;
});

const refreshRotation = async () => {
  rotationQuery.month = rotation.value;
  await refresh();
};

const query = reactive({
  weeks: weekToDisplay.value,
});
const { pending, data: products } = await useFetchApi(
  "/api/stock/products/folders/where-orders-folders-not-closed"
);
const { data: calender, execute } = await useFetchApi("/api/stock/calender", {
  method: "GET",
  query: query,
});
const totalRotateByProduct = (product) => {
  rotations.value.forEach((rotation) => {
    if (rotation.product_id === product.id) {
      product.rotation = rotation.total;
    }

  });
  return product;
};
const calendarDate = computed({
  get: () => calender.value,
  set: (value) => {
    calender.value = value;
  },
});
watch(weekToDisplay, (value) => {
  query.weeks = value

  getstockCalandar();
});
const refreshData = async () => {
  query.weeks = weekToDisplay.value;

  await execute();
};
const allproducts = shallowRef(products.value);
const stockTableVal = ["Stock", "Conso", "Cmd", "Fourn"];
const tableFixedHeads = [
  "Référence",
  "Rotation",
  "Stock",
  "Fournisseur",
  "Catégorie",
  // 'Dispo X sem',
  // 'Conso X sem',
];

const currentWeek = computed(() => {
  const currentDate = new Date();
  const weekNumber = getWeek(currentDate);
  return weekNumber;
});

const getstockCalandar = () => {
  stockCalandar.value = [];
  // load.inventory = true;

  // let firstDay = response.data.first_day;
  const { first_day, last_day } = calender.value;
  console.log(calender.value);

  const startDate = new Date(first_day);
  const totalWeeks = weekToDisplay.value;
  const dateBetween = {};
  for (let i = 0; i < totalWeeks; i++) {
    // Calculate the difference in days between the provided date and the start of the ISO week
    const daysToStartOfWeek = (startDate.getDay() + 6) % 7;

    // Clone the date and set it to the start of the ISO week
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() - daysToStartOfWeek + i * 7);

    // Go to the Monday of this week (day 1 of the ISO week)
    while (currentDate.getDay() !== 1) {
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Create the date of the end of the week by adding 6 days to the start date
    const endDate = new Date(currentDate);
    endDate.setDate(endDate.getDate() + 6);

    // Use your function getWeek to get the week number
    const weekNumber = getWeek(currentDate);

    // Create the object containing the information about the week
    const weekRange = {
      start_of_week: currentDate.toLocaleDateString("fr-FR"),
      end_of_week: endDate.toLocaleDateString("fr-FR"),
      week_number: weekNumber,
      year: currentDate.getFullYear(),
    };

    // Add the object to your stockCalandar.value array
    stockCalandar.value.push(weekRange);
  }
};

const getWeek = (date) => {
  // return le numero de la semaine
  const target = new Date(date.valueOf());
  const dayNr = (date.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);

  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
  }

  return Math.ceil((firstThursday - target) / (7 * 24 * 3600 * 1000)) + 1;
};
onMounted(() => {
  getstockCalandar();
});
const rowData = {
  Rotation: "rotation",
  Stock: "stock",
  Référence: "label",
  categorie: "categorie",
  Fournisseur: "fournisseur",
  Catégorie: "categorie",
};
const productSelected = ref(null);
const quantityInput = reactive({ index: null });
const is_upadted_product = ref([]);
const is_selected_product_id = ref(null);
const current_proctuct_to_update = ref(null);
const openProductToEdit = (product, index) => {
  //current product witch will be updated
  is_selected_product_id.value = product.id;
  productSelected.value = product;
  quantityInput.index = index;
  //open the modal
  is_upadted_product.value = true;
};
let totalStockQty = 0;
let totalOrderQty = reactive({});
let stock = reactive({});
const currentProduct = ref(null);
const filterData = computed(() =>
  allproducts.value?.filter(
    (productData) =>
      (totalStockQty += parseFloat(productData.qty)) &&
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
      productData.id.toString().includes(search.value.toLowerCase())
  )
);

const calculateTotalProductStock = computed(() => {
  return filterData.value.map((product, key) => {
    const {
      qty = {},
      total_order_folder_qty = {},
      total_order_qty = {},

    } = product;

    let rest = 0;

    //regrouper les  total_order_qty par année et par semaine puis les additionner
    stockCalandar.value.map((week, index) => {
      const year = week.year;
      const week_number = week.week_number;

      let expectedStock = total_order_folder_qty[year]?.[week_number] || 0;
      let orderQty = total_order_qty?.[year]?.[week_number] || 0;
      //recuperer la quantité restante par rapport à la conso et la commande pour chaque semaine
      if (
        totalOrderQty.cmd[year] &&
        totalOrderQty.cmd[year]?.[week_number]
      ) {
        totalOrderQty.cmd[year][week_number] += orderQty;
      } else {
        totalOrderQty.cmd[year] = {
          ...totalOrderQty.cmd[year],
          [week_number]: orderQty,
        };
      }
      if (
        totalOrderQty.conso[year] &&
        totalOrderQty.conso[year]?.[week_number]
      ) {
        totalOrderQty.conso[year][week_number] += expectedStock;
      } else {
        totalOrderQty.conso[year] = {
          ...totalOrderQty.conso[year],
          [week_number]: expectedStock,
        };
      }

      if (index === 0) {
        rest =
          totalStockQty +
          parseFloat(totalOrderQty.cmd[year][week_number]) -
          parseFloat(totalOrderQty.conso[year][week_number]);
      } else {
        rest +=
          parseFloat(totalOrderQty.cmd[year][week_number]) -
          parseFloat(totalOrderQty.conso[year][week_number]);
      }

      totalOrderQty.rest = { ...totalOrderQty.rest, [index]: rest };
    });
    return { totalStockQty, totalOrderQty };
  });
});

const rotationsValues = ref([]);
watch(filterData, (value) => {
  totalStockQty = value.reduce((acc, product) => {
    return acc + parseFloat(product.qty);
  }, 0)
  totalOrderQty = { cmd: {}, conso: {}, rest: 0, id: {} };
  stock = { rest: {}, conso: {}, cmd: {}, reference: {} };
  currentProduct.value = value
  calculateTotalProductStock.value
}, { immediate: true });



const calculateRemainingStock = (product, year, week_number, index) => {
  const { total_order_qty, total_order_folder_qty, qty } = product;
  const totalOrderCmQty = total_order_qty?.[year]?.[week_number] || 0;
  const totalOrderFolderConsoQty = total_order_folder_qty?.[year]?.[week_number] || 0;
  if (index == 0) {
    rest = parseFloat(qty) + totalOrderCmQty - parseFloat(totalOrderFolderConsoQty);
  } else {
    rest += totalOrderCmQty - parseFloat(totalOrderFolderConsoQty);
  }
  //
  return rest.toFixed(2);

};


</script>

<template>
  <ClientOnly>
    <div
      class="p-4 bg-white block sm:flex items-center justify-between border-b border-gray-200 lg:mt-1.5 dark:bg-gray-800 dark:border-gray-700">
      <div class="w-full mb-1">

        <div class="overflow-x-auto sm:mx-0.5 lg:mx-0.5  flex items-center justify-center my-8">
          <div
            class="inline-block w-full xl:max-w-[115rem]  sm:px-6 lg:px-2 verflow-hidden left-0 2xl:max-w-[calc(100vw-19rem)]">
            <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
              <div class="flex items-center space-x-1">
                <div class="pb-2  dark:bg-gray-900">
                  <label for="table-search" class="sr-only">Search</label>
                  <div class="relative mt-1">
                    <div class="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                      <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                      </svg>
                    </div>
                    <input type="text" id="table-search" v-model="search" autocomplete="off"
                      class="block pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 py-2"
                      placeholder="Search for items" />
                  </div>
                </div>
                <div class="pb-2  dark:bg-gray-900">
                  <div class="relative mt-1">
                    <input type="number" v-model="weekToDisplay" id="" @input="refreshData()" min="1"
                      class="block pt-2 ps-6 text-sm text-gray-900 border border-gray-300 rounded-lg w-20 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 py-2">
                  </div>
                </div>
                <div class="pb-2  dark:bg-gray-900">
                  <div class="relative mt-1">
                    <input type="number" v-model="rotation" id="" min="1" @input="refreshRotation()"
                      class="block pt-2 ps-6 text-sm text-gray-900 border border-gray-300 rounded-lg w-20 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 py-2">
                  </div>
                </div>
              </div>
              <div
                class="relative overflow-auto max-h-[calc(100vh-9rem)] rounded stock-scroll mx-auto shadow-md sm:rounded-lg bg-slate-300 w-full">
                <table class="relative w-full h-full m-auto cursor-default md:table-auto bg-slate-300 ">
                  <thead class="sticky top-0 z-10 bg-white dark:bg-gray-800 dark:text-gray-400">
                    <tr class="text-gray-900 z-1 bg-slate-200 first:sticky first:top-0">
                      <th rowspan="3" scope="col"
                        class="font-medium text-left uppercase text-xs bg-slate-200 border-r border-gray-300 first:sticky left-0 [&:nth-child(2)]:sticky [&:nth-child(2)]:left-[23.75rem] [&:nth-child(3)]:sticky [&:nth-child(3)]:left-[27.8rem] [&:nth-child(4)]:sticky [&:nth-child(4)]:left-[31.8rem] "
                        v-for="(headtable, headIndex) in tableFixedHeads" :key="headIndex">
                        <div class="flex items-center space-x-5">
                          <template v-if="headtable == 'Référence'">
                            <div aria-sort="ascending"
                              class="flex items-center justify-between p-1 space-x-1 cursor-pointer">
                              <span>{{ headtable }}</span>
                            </div>
                          </template>
                          <template v-else-if="headtable == 'Rotation'">
                            <div class="flex items-center justify-between cursor-pointer" aria-sort="ascending">
                              <span class="text-center basis-1/2">{{ headtable }}</span>
                            </div>
                          </template>
                          <template v-else-if="headtable == 'Stock'">
                            <div class="flex items-center justify-between p-1 mx-1 space-x-1 cursor-pointer">
                              <span class="text-center basis-1/2">{{ headtable }}</span>
                            </div>
                          </template>
                          <template v-else-if="headtable == 'Fournisseur'">
                            <div class="flex items-center justify-between mx-1 space-x-1 text-center cursor-pointer">
                              <span class="text-center basis-1/2">{{ headtable }}</span>
                            </div>
                          </template>
                          <template v-else-if="headtable == 'Catégorie'">
                            <div class="flex items-center justify-between p-1 space-x-1 cursor-pointer">
                              <span class="text-center basis-1/2">{{
                      headtable
                    }}</span>

                            </div>
                          </template>
                        </div>

                      </th>
                      <th scope="col" v-for="(currentDate, indexDate ) in stockCalandar" :key="currentDate"
                        class="text-xs font-normal text-left border-r border-gray-300"
                        :class="currentDate.week_number == currentWeek ? 'bg-green-200 ' : 'bg-slate-200'">
                    <tr class="flex flex-row items-center justify-between w-full gap-8 px-2 border-b border-gray-300">
                      <th class=" text-center basis-1/3 text-xs">
                        <span class="block">{{ currentDate.start_of_week }}</span>
                      </th>
                      <th class="flex items-center justify-center space-x-1 text-center basis-1/3 text-xs">
                        <span class="block">{{ "semaine " }}</span>
                        <span class="block">{{ currentDate.week_number }}</span>
                      </th>
                      <th class="text-center basis-1/3 text-xs">
                        {{ currentDate.end_of_week }}
                      </th>
                    </tr>
                    <tr class="flex flex-row items-center justify-between text-center flex-nowrap">
                      <template v-for="(head, headIndex) in stockTableVal" :key="headIndex">
                        <th
                          class="flex items-center justify-between px-1 space-x-1 text-center border-r border-gray-300 cursor-pointer basis-1/4 text-xs">
                          {{ head }}
                        </th>
                      </template>
                    </tr>
                    </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(product, index) in filterData" :key="product.id"
                      class="bg-gray-300 group odd:bg-slate-50 even:bg-slate-100 hover:bg-blue-100">
                      <th scope="row"
                        class="sticky left-0 px-2 font-medium text-left border-r border-gray-300 text-xs whitespace-nowrap group-hover:bg-blue-100 bg-inherit">
                        <div class="gap-2">
                          {{ product.label }}
                        </div>
                      </th>
                      <td
                        class="font-light text-center text-gray-900 openTD text-xs whitespace-nowrap bg-inherit border-r border-gray-300 sticky left-[23.75rem]">
                        {{ totalRotateByProduct(product).rotation }}
                      </td>
                      <td @dblclick=" openProductToEdit(product, index)"
                        class="font-light text-center text-gray-900 openTD text-xs whitespace-nowrap bg-inherit border-r border-gray-300 sticky left-[27.8rem]"
                        :class="'quantityInput' + index, product.qty < 0 ? 'bg-red-200' : ''">
                        <div v-if="is_upadted_product && is_selected_product_id == product.id"
                          class="flex items-center justify-center max-w-xs justify-items-center">
                          <input type="text" step=".1" v-model="product.qty"
                            class="w-20 h-5 px-1 text-black rounded-sm text-xs" />
                        </div>
                        <div v-else>
                          {{ product.qty }}
                        </div>
                      </td>
                      <td scope="row"
                        class="font-sans font-light text-center border-r border-gray-300 text-xs whitespace-nowrap sticky bg-inherit left-[31.8rem]">
                        <div class="px-1"> {{ product?.first_supplier_name?.name }}</div>
                      </td>
                      <td
                        class="font-light text-center text-gray-900 border-r border-gray-300 text-xs whitespace-nowrap ">
                        <div class="gap-2 px-1">
                          {{ product.category.label }}
                        </div>
                      </td>
                      <td v-for="( currentDate, index ) in stockCalandar" :key="index" scope="col"
                        class="p-0 font-light text-gray-900 truncate border-r border-gray-300 text-xs "
                        :class="currentDate.week_number == currentWeek ? 'bg-green-200 group-hover:bg-blue-100 ' : ''">
                        <div class="flex items-center">
                          <div v-for="(con, conIndex) in stockTableVal" :key="conIndex" class="basis-1/4 last:border-0">
                            <div v-if="con == 'Stock'"
                              class="flex items-center justify-center h-4 text-center basis-1/4 rest" :class="calculateRemainingStock(product, currentDate.year, currentDate.week_number,
                      index) < 0 ? 'bg-red-200 ' : ''">
                              <span>{{ rest?.toFixed(2) }}</span>
                            </div>
                            <div v-else-if="con == 'Conso'"
                              class="flex items-center justify-center h-4 text-center cursor-pointer basis-1/4">
                              {{
                      product.total_order_folder_qty?.[currentDate.year]?.[currentDate.week_number]?.toFixed(2)
                    }}
                              <input type="hidden" class="currentreset" />
                            </div>
                            <div v-else-if="con == 'Cmd'"
                              class="flex items-center justify-center text-center cursor-pointer">
                              <span class="text-5xs">{{
                      product.total_order_qty?.[currentDate.year]?.[currentDate.week_number] }}</span>
                            </div>
                            <div
                              v-else-if="con == 'Fourn' && product.total_order_qty?.[currentDate.year]?.[currentDate.week_number]?.toFixed(2)"
                              class="flex items-center justify-center h-4 font-normal text-center  text-5xs basis-1/4">
                              <span class="flex items-center w-full ml-1 text-center text-xs">
                                {{ product.first_supplier_name?.name }}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <th scope="row"
                        class="sticky bottom-0 left-0 px-2 font-medium text-left border-r border-gray-300 text-xxs whitespace-nowrap bg-slate-200 z-1">
                        <div class="gap-2">Total</div>
                      </th>
                      <td scope="row"
                        class="font-light text-center text-gray-900 openTD text-xxs whitespace-nowrap bg-slate-200 border-r border-gray-300 sticky bottom-0 left-[23.75rem] z-1">
                      </td>
                      <td scope="row"
                        class="font-light text-center text-gray-900 openTD text-xxs whitespace-nowrap bg-slate-200 z-1 border-r border-gray-300 sticky bottom-0 left-[27.8rem]">
                        {{ totalStockQty.toFixed(2) }}
                      </td>
                      <td scope="row"
                        class="sticky bottom-0 font-sans font-light text-center border-r border-gray-300 text-xxs whitespace-nowrap bg-slate-200 left-[31.8rem] z-1">
                      </td>
                      <td scope="row"
                        class="sticky bottom-0 font-sans font-light text-center border-r border-gray-300 text-xxs whitespace-nowrap bg-slate-200 z-1 ">
                      </td>
                      <th scope="col"
                        class="sticky bottom-0 text-xs font-normal text-left border-r border-collapse border-gray-300"
                        :class="currentDate.week_number == currentWeek ? 'bg-green-200' : 'bg-slate-200'"
                        v-for="(currentDate, indexdate) in stockCalandar" :key="indexdate">
                        <div class="flex flex-row items-center justify-between text-center flex-nowrap">
                          <div v-for="(consomable, index ) in stockTableVal" :key="index"
                            class="gap-5 text-center basis-1/4 text-xxs">
                            <div v-if="consomable == 'Stock' && totalOrderQty.rest?.[indexdate]"
                              class="text-center basis-1/4">
                              {{ totalOrderQty.rest?.[indexdate].toFixed(2) || 0 }}
                            </div>
                            <div v-if="consomable == 'Conso'" class="text-center basis-1/4">
                              {{ totalOrderQty.conso?.[currentDate.year]?.[currentDate.week_number]?.toFixed(2) || 0 }}
                            </div>
                            <div v-if="consomable == 'Cmd'" class="text-center basis-1/4">
                              {{ totalOrderQty.cmd?.[currentDate.year]?.[currentDate.week_number]?.toFixed(2) || 0 }}
                            </div>
                          </div>
                        </div>
                      </th>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>



<style scoped>
.table-wrp {
  max-height: 75vh;
  overflow-y: auto;
  display: block;
}

thead {
  position: sticky;
  top: 0;
}
</style>
