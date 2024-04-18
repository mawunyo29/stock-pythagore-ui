<script lang="ts" setup>
const props = defineProps<{
  type: 'button' | 'submit' | 'reset'
  color: 'primary' | 'secondary' | 'danger'
  size: 'sm' | 'md' | 'lg'
  label: string
}>()
const type = props.type || 'button'
const color = props.color || 'primary'
const size = props.size || 'md'
const label = props.label || 'Button'

const classes = [
  'py-2.5',
  'px-5',
  'me-2',
  'mb-2',
  `text-${size}`,
  'font-medium',
  'text-gray-900',
  'focus:outline-none',
  'bg-white',
  'rounded-lg',
  'border',
  'border-gray-200',
  'hover:bg-gray-100',

  'focus:z-10',
  'focus:ring-4',
  'focus:ring-gray-100',
  'dark:focus:ring-gray-700',
  'dark:bg-gray-800',
  'dark:text-gray-400',
  'dark:border-gray-600',
  'dark:hover:text-white',
  'dark:hover:bg-gray-700'
]

if (color === 'primary') {
  classes.push('text-gray-700', 'bg-primary-700', 'hover:bg-primary-500', 'focus:ring-primary-300', 'dark:focus:ring-primary-800', 'hover:text-gray-50')
} else if (color === 'secondary') {
  classes.push('text-gray-700', 'bg-secondary-700', 'hover:bg-secondary-800', 'focus:ring-secondary-300', 'dark:focus:ring-secondary-800', 'hover:text-gray-700')
} else if (color === 'danger') {
  classes.push('text-gray-700', 'bg-red-700', 'hover:bg-red-800', 'focus:ring-red-300', 'dark:focus:ring-red-800')
} else if (color === 'success') {
  classes.push('text-gray-700', 'bg-green-700', 'hover:bg-green-800', 'focus:ring-green-300', 'dark:focus:ring-green-800')
} else if (color === 'warning') {
  classes.push('text-gray-700', 'bg-yellow-700', 'hover:bg-yellow-800', 'focus:ring-yellow-300', 'dark:focus:ring-yellow-800')
} else if (color === 'info') {
  classes.push('text-gray-700', 'bg-blue-700', 'hover:bg-blue-800', 'focus:ring-blue-300', 'dark:focus:ring-blue-800')
} else if (color === 'dark') {
  classes.push('text-gray-700', 'bg-gray-700', 'hover:bg-gray-800', 'focus:ring-gray-300', 'dark:focus:ring-gray-800')
} else if (color === 'light') {
  classes.push('text-gray-700', 'bg-gray-100', 'hover:bg-gray-200', 'focus:ring-gray-300', 'dark:focus:ring-gray-800')
} else if (color === 'alternative') {
  classes.push('py-2.5', 'px-5', 'me-2', 'mb-2', 'font-medium', 'text-gray-900', 'focus:outline-none', 'bg-white rounded-lg', 'border border-gray-200', 'hover:bg-gray-100', 'hover:text-blue-700', 'focus:z-10', 'focus:ring-4', 'dark:focus:ring-gray-700', 'dark:bg-gray-800', 'dark:text-gray-400', 'dark:border-gray-600', ' dark:hover:text-white', 'dark:hover:bg-gray-700')
}


</script>

<template>
  <button :type="type" :class="classes">
    {{ label }}
  </button>
</template>

<style scoped></style>
