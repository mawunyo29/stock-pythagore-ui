<script setup>
const props = defineProps({
  tableHeads: {
    type: Array,
    required: false,
  },
  classes: {
    type: String,
    default: "",
  },
  trClasses: {
    type: String,
    default: "",
  },
  thClasses: {
    type: String,
    default: "",
  },
  rowData: {
    type: Object,
    required: false,
  },
  product: {
    type: Object,
    required: false,
  },
});
const product = computed(() => {
  return props.product;
});
</script>

<template>
  <tr>
    <slot />
  </tr>
</template>
