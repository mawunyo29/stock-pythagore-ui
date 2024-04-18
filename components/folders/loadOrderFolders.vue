<script setup>
const props = defineProps({
  orderFolders: {
    type: Object,
    required: true,
  },
  orderFolderData: {
    type: Object,
    required: false,
  },
});
const tableHeaders = [
  { name: "C/M", active: true },
  { name: "Client", active: true },
  { name: "Commande", active: true },
  { name: "Date du besoin", active: true },
  { name: "Date Appro Matière", active: true },
  { name: "Cut", active: true },
  { name: "Nb Tranches", active: true },
  { name: "Type", active: true },
  { name: "Statut", active: true },
];
const currentProduct = computed(() => {
  return props.orderFolderData.product;
});
const currentrest = computed(() => {
  return props.orderFolderData.rest;
});
const orderFoldersData = shallowRef(props.orderFolders.currentFolders);
const nextFolders = shallowRef(props.orderFolders.nextFolders);
const canCut = computed(() => {
  let total = 0;
  let folders = [];

  if (currentrest.value < 0) {
    //derterminer si le stock actuel est suffisant pour couper les tranches des derniers dossiers
    let absoluteValue = Math.abs(currentrest.value);
    let i = orderFoldersData.value.length - 1;
    while (total < absoluteValue) {
      total += orderFoldersData.value[i].expected_stock;
      folders = [...folders, orderFoldersData.value[i]?.id];
      folders = folders.reverse();

      i--;
    }
  }
  return folders;
});
console.log(orderFoldersData.value);
</script>

<template>
  <div>
    <div
      class="w-full my-2 alert"
      :class="currentrest > 0 ? 'success' : 'danger'"
    >
      <p class="px-5 font-medium text-left uppercase">
        Niveau du stock actuel: {{ currentrest }}
      </p>
    </div>
    <BaseTable
      class="min-w-full table-fixed divide-y divide-gray-300 dark:divide-gray-700"
    >
      <thead class="relative">
        <TableRow
          class="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
        >
          <TableHead
            v-for="header in tableHeaders"
            :key="header.name"
            class="text-left rtl:text-right px-4 py-3.5 text-gray-900 dark:text-white font-semibold text-sm"
          >
            <Icon
              v-if="header.active"
              name="i-heroicons-arrows-up-down-20-solid"
              class="w-4 h-4 mr-1"
            />
            {{ header.name }}
          </TableHead>
        </TableRow>
      </thead>
      <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
        <TableRow
          v-for="order in orderFoldersData"
          trClasses="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
        >
          <table-columns>
            {{ order.folder?.ref_client }}
          </table-columns>
          <table-columns>
            {{ order.folder?.society?.name }}
          </table-columns>
          <table-columns>
            {{ order.folder?.ref }}
          </table-columns>
          <table-columns>
            {{
              usedateTimeForamat(order?.date, {
                local: "fr",
                format: "date",
              })
            }}
          </table-columns>
          <table-columns>
            {{
              usedateTimeForamat(order?.supplier_date, {
                local: "fr",
                format: "date",
              })
            }}
          </table-columns>
          <table-columns> {{ order?.expected_cts }}</table-columns>
          <table-columns> {{ order?.expected_stock }} </table-columns>
          <table-columns> {{ order?.type }}</table-columns>
          <table-columns class="flex justify-center items-center w-full">
            <div class="flex justify-center items-center w-full">
              <span
                class="flex items-center w-full justify-center text-green-400"
                v-if="currentrest > 0"
              >
                <Icon name="lucide:circle-alert" class="w-5 h-5" />
              </span>
              <span
                v-else
                class="text-xs font-semibold leading-tight text-red-700 rounded-full"
              >
                <template v-if="canCut.includes(order.id)">
                  <span class="flex items-center justify-center w-full">
                    <Icon name="lucide:circle-alert" class="w-5 h-5" />
                  </span>
                </template>
                <template>
                  <span
                    class="flex items-center justify-center w-full text-green-400"
                  >
                    <Icon name="lucide:circle-alert" class="w-5 h-5" />
                  </span>
                </template>
              </span>
            </div>
          </table-columns>
        </TableRow>
      </tbody>
    </BaseTable>
    <div class="pt-8">
      <div class="w-full mb-4">
        <h2
          class="flex items-center justify-center w-full font-medium uppercase sm:text-2xl"
        >
          Stock à venir
        </h2>
      </div>
      <BaseTable
        class="min-w-full table-fixed divide-y divide-gray-300 dark:divide-gray-700"
        v-if="nextFolders.length > 0"
      >
        <thead class="relative">
          <TableRow
            class="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
          >
            <TableHead
              v-for="header in tableHeaders"
              :key="header.name"
              class="text-left rtl:text-right px-4 py-3.5 text-gray-900 dark:text-white font-semibold text-sm"
            >
              <Icon
                v-if="header.active"
                name="i-heroicons-arrows-up-down-20-solid"
                class="w-4 h-4 mr-1"
              />
              {{ header.name }}
            </TableHead>
          </TableRow>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
          <TableRow
            v-for="order in nextFolders"
            trClasses="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
          >
            <table-columns>
              {{ order.folder?.ref_client }}
            </table-columns>
            <table-columns>
              {{ order.folder?.society?.name }}
            </table-columns>
            <table-columns>
              {{ order.folder?.ref }}
            </table-columns>
            <table-columns>
              {{
                usedateTimeForamat(order?.date, {
                  local: "fr",
                  format: "date",
                })
              }}
            </table-columns>
            <table-columns>
              {{
                usedateTimeForamat(order?.supplier_date, {
                  local: "fr",
                  format: "date",
                })
              }}
            </table-columns>
            <table-columns> {{ order?.expected_cts }}</table-columns>
            <table-columns> {{ order?.expected_stock }} </table-columns>
            <table-columns> {{ order?.type }}</table-columns>
            <table-columns class="flex justify-center items-center w-full">
              <div class="flex justify-center items-center w-full">
                <span
                  class="flex items-center w-full justify-center text-green-400"
                  v-if="currentrest > 0"
                >
                  <Icon name="lucide:circle-alert" class="w-5 h-5" />
                </span>
                <span
                  v-else
                  class="text-xs font-semibold leading-tight text-red-700 rounded-full"
                >
                  <template>
                    <span class="flex items-center justify-center w-full">
                      <Icon name="lucide:circle-alert" class="w-5 h-5" />
                    </span>
                  </template>
                  <template>
                    <span
                      class="flex items-center justify-center w-full text-green-400"
                    >
                      <Icon name="lucide:circle-alert" class="w-5 h-5" />
                    </span>
                  </template>
                </span>
              </div>
            </table-columns>
          </TableRow>
        </tbody>
      </BaseTable>
    </div>
  </div>
</template>

<style scoped></style>
