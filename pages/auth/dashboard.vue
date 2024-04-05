<script setup>
definePageMeta({
  middleware: "guest",
  title: "Dashboard",
  description: "Dashboard page",
  alias: "/dashboard",
  middleware: "auth",
});
</script>
<template>
  <div>Page: auth/dashboard</div>
</template>

<style scoped></style>
