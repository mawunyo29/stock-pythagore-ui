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
});
</script>

<template>
  <th>
    <slot />
  </th>
</template>

<style scoped></style>
