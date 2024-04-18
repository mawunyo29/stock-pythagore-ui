<script setup>
import { useSupplierStore } from "~/stores/supplier/useSupplierStore";
import { useDayjs } from "#dayjs";
const actions = ref({
  create: false,
  update: false,
  delete: false,
  selcetedSupplier: true,
});
const search = ref({
  supplier: "",
  product: "",
});
const supplierSearch = ref("");
const isSlected = useState('selected', () => actions.value.selcetedSupplier);
const formOrder = ref({
  expected_delivery_date: "",
  supplier: "",
  comment: "",
});
const loadData = ref({});
const currentOrder = ref({});
let datenow = new Date();
let yearNow = datenow.getFullYear();
const isCurrentDates = ref([]);
const isCurrentDate = ref(yearNow);
const { fetchSupplierOrderYears, fecthSupplierOrdersByYear, fetchSuppliers } =
  useSupplierStore();
const {
  data: supplierDto,
  error: supplierOrderYearsError,
  execute,
} = await useAsyncData("supplier-orders", async () => {
  const [years, supplierOrders, suppliers] = await Promise.all([
    fetchSupplierOrderYears(),
    fecthSupplierOrdersByYear(isCurrentDate.value),
    fetchSuppliers(),
  ]);
  return { years, supplierOrders, suppliers };
});

const createOrderSupplier = () => {
  console.log("create order supplier");
};
const openOrderSupplier = () => {
  console.log("open order supplier");
};
const selectCurrentYear = async (e) => {
  yearNow = e.target.innerHTML;
  isCurrentDate.value = yearNow;
  await reload(isCurrentDate.value);
  console.log("selectCurrentYear", isCurrentDate.value);
  search.value.product = "";
};
const orderDatas = shallowRef([]);
const dataYears = ref([]);
const suppliersdata = shallowRef([]);

const formatDate = (date, format) => {
  const dayjs = useDayjs();

  return dayjs(date, format).locale("fr").format("DD/MM/YYYY");
};
const reload = async (date) => {
  isCurrentDate.value = parseInt(date);
  await execute();
  orderDatas.value = supplierDto.value.supplierOrders;
  dataYears.value = supplierDto.value.years;
  suppliersdata.value = supplierDto.value.suppliers;

};


const orderIsClosed = ref([]);
const closeCurrentOrder = (value) => {
  orderIsClosed.value = value;
};
watch(isCurrentDates.value, (value) => {
  if (value) {
    let btns = value;
    btns.forEach((btn) => {
      let toInt = parseInt(btn.innerText);
      let isContainsClassActive = btn.classList.contains("active");
      if (toInt === yearNow && !isContainsClassActive) {
        btn.classList.add("bg-primary", "text-white", "overflow-hidden");
      } else {
        btn.classList.remove("bg-primary", "text-white", "overflow-hidden");
      }
      btn.addEventListener("click", () => {
        localStorage.setItem("activeDate", btn.innerText);
        let activeTab = localStorage.getItem("activeDate");
        if (btn.innerText) {
          btns.forEach((btn) => {
            if (btn.innerText === activeTab) {
              isCurrentDate.value = activeTab;
              btn.classList.add("active", "bg-primary", "text-white");
            } else {
              btn.classList.remove("active", "bg-primary", "text-white");
            }
          });
        }
      });
    });
  }
});
onMounted(() => {
  orderDatas.value = supplierDto.value?.supplierOrders;
  dataYears.value = supplierDto.value?.years;

});
onUnmounted(() => {
  isCurrentDates.value = [];
  orderDatas.value = [];
  dataYears.value = [];
});
const searchSupplier = (searchData, search) => {
  loadData.value.suppliers = searchData?.dataResult;

};
const openToCreateCommand = () => {
  actions.value.create = !actions.value.create;
  supplierSearch.value = "";
};

const is_valided = () => {
  if (
    formOrder.expected_delivery_date == null ||
    formOrder.expected_delivery_date == ""
  ) {
    return false;
  } else {
    return true;
  }
};
const selectSupplier = (supplier) => {
  isSlected.value = false;
  loadData.value.suppliers = {};
  formOrder.supplier = supplier.name;
  supplierSearch.value = supplier.name;

};
const showCreateModal = computed(() => {
  return loadData.value?.suppliers?.length > 0 && supplierSearch.value.length > 0 && isSlected.value;
});
watch(supplierSearch, (newValue, oldValue) => {
  if (newValue.length < oldValue.length) {
    isSlected.value = true;
  }
});

</script>

<template>
  <div class="py-4 w-full ">
    <div class="flex items-center justify-between p-2 border-b">
      <div class="basis-1/3">
        <base-button @click="openToCreateCommand()" color="alternative" label=" Créer une commande" size="sm"
          type="button" />
      </div>
      <div class="flex justify-between basis-2/3">
        <div>
          <!-- <BreezeInput type="date" name="" id="" v-model="selectedDate" /> -->
        </div>
        <button class="text-gray-600 hover:text-gray-700 focus:outline-none focus:text-gray-700">
          <!-- <X class="w-5 h-5" /> @click="modalClose()"-->
        </button>
      </div>
    </div>

    <div class="z-50 group relative " :class="{ 'hidden ': !actions.create }">
      <div class=" absolute  flex justify-start justify-items-end items-center  top-2  lg:w-1/3 w-full">
        <form class=" transition-opacity w-full bg-white p-2 rounded shadow" @submit.prevent="createOrderSupplier()"
          id="supplier_">
          <div class="block w-full gap-2 p-1">
            <div class="flex flex-row items-center justify-between gap-4 py-3 sm:pb-4">
              <div class="flex flex-col basis-1/2">
                <BaseLabel for="norder_date" value="Date de livraison prévue" />
                <input type="date" v-model="formOrder.expected_delivery_date" :class="'w-full'" id="order_date"
                  aria-required="true" required />
              </div>
              <div class="relative flex flex-col basis-1/2 space-y-0.5 h-hull">
                <div>
                  <label for="supplier_name" class="space-x-2">
                    <span>Fournisseur</span>
                    <span class="text-xs">(liste déroulante)</span>
                  </label>
                  <!-- <input type="text" v-model="search.supplier" :class="'w-full'" :aria-required="true" :required="true" /> -->
                  <div class="">
                    <search-bar :placeholder="'Rechercher par référence'" v-model="supplierSearch" :clearable="true"
                      :dataToFilter="suppliersdata?.suppliers" @update:datafilter="searchSupplier" :aria-required="true"
                      :required="true" />
                  </div>
                </div>
                <div class="relative">
                  <div v-if="showCreateModal"
                    class=" absolute z-50 w-full  bg-white border rounded overflow-scrow-span-full">
                    <div>
                      <div v-for="supplier in loadData.suppliers"
                        class="w-full p-2 py-2  cursor-pointer hover:bg-slate-50" :key="supplier.id"
                        @click="selectSupplier(supplier)">
                        <p class="text-xs uppercase">
                          {{ supplier.name }}
                        </p>
                      </div>
                      <template v-if="loadData.suppliers?.length === 0
                      ">
                        <p class="absolute bottom-0 z-50 text-xs text-red-300 top-3">
                          Aucun fournisseur trouvé
                        </p>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- <Textarea v-model="formOrder.comment" /> -->
          </div>
          <div class="flex justify-end w-full border-t border-t-slate-100 group">
            <div class="flex justify-end p-1">
              <button :type="is_valided ? 'reset' : 'button'"
                class="px-4 py-1 text-sm font-medium text-gray-700 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300 focus:outline-none focus:bg-gray-300 focus:border-gray-400 btn"
                @click="openToCreateCommand()">
                Annuler
              </button>
              <button type="submit"
                class="px-4 py-1 ml-2 text-sm font-medium text-white bg-blue-500 border border-transparent hover:bg-blue-600 focus:outline-none focus:bg-blue-600 focus:border-blue-700 btn-primary">
                Ajouter
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
    <order-crud :isSeletedyear="isCurrentDate" :orderIsClosed="orderIsClosed" :currentSelelectedOrder="currentOrder"
      @update:orderIsClosed="closeCurrentOrder" @update:isSeletedyear="reload">
      <template v-slot="{ openCurrentOrder }">
        <div class="overflow-hidden lg:basis-1/5 container">

          <div class=" space-y-2 divide-gray-300 rounded max-h-[90vh] overflow-y-auto ">
            <div v-for="(ordersProducts, value) in orderDatas" :key="value" class="w-full rounded h-full ">
              <div v-for="(datayear, datayearKey) in dataYears" :key="datayear" class="">
                <button @click="selectCurrentYear" ref="isCurrentDates"
                  class="flex items-center justify-center w-full py-2 my-2 text-base font-semibold text-center border rounded shadow after:text-center sticky top-0">
                  {{ datayear }}
                </button>
                <template v-if="parseInt(datayear) === parseInt(isCurrentDate)">
                  <div v-for="(orders, index) in ordersProducts" :key="orders[0].id">
                    <order-list :orders="orders" :folderSelected="currentOrder"
                      @update:folderSelected="openCurrentOrder">
                      <div
                        class="flex flex-row justify-between w-full px-1 py-2 bg-white border-b rounded-none cursor-pointer "
                        v-for="(order, orderKey) in orders" :key="orderKey" @click="openCurrentOrder(order)">
                        <div class="flex items-center justify-between w-full">
                          <div class="">
                            <p class="font-semibold">
                              <span>{{ order.reference }}</span>
                            </p>
                            <p class="">
                              {{
                                formatDate(
                                  order.expected_delivery_date,
                                  "YYYY-MM-DD"
                                )
                              }}
                            </p>
                          </div>
                        </div>
                      </div>
                    </order-list>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </template>
    </order-crud>
  </div>
</template>

<style scoped></style>
