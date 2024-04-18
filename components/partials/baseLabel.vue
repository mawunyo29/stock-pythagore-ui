<script setup>
const props = defineProps({
    value: {
        type: String,
        required: true,
    },
});
</script>
<template>
    <label class="block text-sm font-medium text-gray-700">
        {{ value }}
    </label>
</template>

<style scoped></style>