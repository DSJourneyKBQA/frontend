<template>
  <button class="mr-1 border rounded-md transition-colors whitespace-nowrap" :class="classList">
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  primary: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: Boolean,
    default: false,
  },
})

const classList = computed(() => {
  const classes = []

  if (props.primary)
    classes.push('bg-blue-500 text-white hover:bg-blue-400')

  else
    classes.push('hover:border-blue-500')

  if (props.icon)
    classes.push('p-1')

  else
    classes.push('px-6 py-1 mb-1')

  return classes
})
</script>
