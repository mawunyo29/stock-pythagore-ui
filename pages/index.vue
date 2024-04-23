<script setup lang="ts">
const route = useRoute()
//set layout
useHead({
  title: 'Home',

  meta: [
    {
      name: 'description',
      content: 'Home page'

    }
  ]
})
</script>

<template>
  <div class="h-full">
    <Login />
    <h1 class="text-2xl">Home</h1>
  </div>
</template>
