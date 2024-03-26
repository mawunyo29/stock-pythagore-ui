<script  setup>
const calendarDate = ref(null);
const stockCalandar = ref([]);
const weekToDisplay = ref(24);
const allCategories = shallowRef([]);
definePageMeta({
  title: "Stock",
  auth: true,
  name: "stock",
  alias: ["/stock"],
  middleware: ["auth"],
  loading: true
});
const { pending, data: categories } = await useLazyAsyncData('categories', () => useFetchApi('/api/stock/products/first-parent-matiere/data'))
const {  data: calender } = await useLazyAsyncData('calender', () => useFetchApi('/api/stock/calender'))
const stockTableVal = ["Stock", "Conso", "Cmd", "Fourn"];
const tableHeads = [
    "Référence",
    "Rotation",
    "Stock",
    "Fournisseur",
    "Catégorie",
    // 'Dispo X sem',
    // 'Conso X sem',
];

watch(() => categories.value, (value) => {
  allCategories.value = value.data;
  console.log('products', allCategories.value ,pending);
 
});
watch(() => calender.value, (value) => {
  calendarDate.value = value.dat;
  stockCalandar.value = [];
  // load.inventory = true;

  // let firstDay = response.data.first_day;
  const { first_day, last_day } = value.data;
  calendarDate.value = { first_day, last_day };
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

  // load.inventory = false;

});
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
const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
  },
  {
    date: '2016-05-08',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
  },
  {
    date: '2016-05-06',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
  },
  {
    date: '2016-05-07',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
  },
]
</script>

<template>
  <div v-if="pending">
 loading....
  </div>
  <div v-else>
    <template v-for="(category , index) in allCategories">
      <div >
        <h1>{{ category.name }}</h1>
        <table class="table-auto w-full">
          <thead>
            <tr>
              <th v-for="head in tableHeads" :key="head" class="border border-gray-400 px-4 py-2">{{ head }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in category.products" :key="product.id">
              <td class="border border-gray-400 px-4 py-2">{{ product }}</td>
              <td class="border border-gray-400 px-4 py-2">{{ product.rotation }}</td>
              <td class="border border-gray-400 px-4 py-2">{{ product.stock }}</td>
              <td class="border border-gray-400 px-4 py-2">{{ product.supplier }}</td>
              <td class="border border-gray-400 px-4 py-2">{{ product.category }}</td>
            </tr>
          </tbody>
        </table>
      </div>


    </template>
  </div>

</template>

<style scoped></style>
