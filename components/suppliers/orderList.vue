<script setup>
const emit = defineEmits([
  "update:folderSelected",
  "update:is_selected",
  "update:modal",
]);
const { formatDate, startOfWeek, endOfWeek, numberOfWeek } = useFormatDate();
const props = defineProps(["orders", "folderSelected"]);
const isOpen = ref(false);
const toggle = () => {
  isOpen.value = !isOpen.value;

  if (currentOrderOpened.value === undefined) {
    let val = firstOrder.value - 1;
    emit("update:folderSelected", val);
  } else {
    emit("update:folderSelected", currentOrderOpened.value);
  }
};

const firstOrder = computed(() => {
  return props.orders[0];
});

const currentOrderOpened = computed(() => {
  return props.orders.find((order) => order.id === props.folderSelected);
});

const IsClosedAllOrders = computed({
  get() {
    return props.orders?.every((order) => order.is_close);
  },
  set(val) {
    props.orders.forEach((order) => (order.is_closed = val));
  },
});
const formats = ref({
  initial: "YYYY-MM-DD",
  needFormat: "DD/MM/YYYY",
});
const startWeek = computed(() => {
  return startOfWeek(props.orders[0].expected_delivery_date, formats.value);
});
const endWeek = computed(() =>
  endOfWeek(props.orders[0].expected_delivery_date, formats.value)
);
const weekNumber = computed(() => {
  return numberOfWeek(props.orders[0].expected_delivery_date);
});
</script>

<template>
  <div class="flex-1">
    <div class="flex flex-col w-full rounded bg-secondary/30 shadow overflow-hidden text-xs"
      :class="isOpen ? 'ring-1 ring-secondary/30 shadow-lg mb-3' : 'my-1'">
      <button type="button" @click.prevent="toggle()"
        class="flex items-center justify-between w-full font-medium px-1 py-2 active">
        <div>
          <h4 class="font-semibold">
            Semaine n°
            <span>{{ weekNumber }} </span>
          </h4>
          <div
            class="flex space-x-1 items-center justify-items-center justify-center w-full text-xs font-normal text-gray-500">
            <p class="text-center">du start {{ startWeek }} au {{ endWeek }}</p>
          </div>
        </div>
        <div class="rounded-full bg-white p-0.5 shadow-lg" v-if="IsClosedAllOrders"></div>
      </button>
      <div :class="isOpen ? '' : 'hidden'">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
