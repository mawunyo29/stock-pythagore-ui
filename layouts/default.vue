<script lang="ts" setup></script>

<template>
  <div>
    <NavHeader />
    <main class="min-h-screen  flex justify-start items-center right-0 left-0">
        <div class=" relative w-full h-full ">
          <slot></slot>
        </div>
      </main>
  </div>
</template>

<style scoped></style>