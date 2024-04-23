<script lang="ts" setup>
definePageMeta({
  title: "Commandes",
  description: "Liste des commandes",
  name: "Commandes",
  alias: "/commandes",
  layout: "auth",
  middleware: ["auth"],
});
</script>

<template>
  <div
    class="lg:p-4 block sm:flex w-full items-center justify-between border-b border-gray-200 lg:mt-1.5 dark:bg-gray-800 dark:border-gray-700 h-full">

    <supplier-orders />

  </div>
</template>

<style scoped></style>
