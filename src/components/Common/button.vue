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
  dark: {
    type: Boolean,
    default: false,
  },
})

const classList = computed(() => {
  const classes = []

  if (props.icon)
    classes.push('p-1')
  else
    classes.push('px-6 py-1')

  if (props.primary) {
    classes.push('bg-blue-500 text-white hover:bg-blue-400')
    if (props.dark)
      classes.push('border-blue-500 hover:border-blue-400')
  }
  else {
    if (props.dark)
      classes.push('bg-gh-btn hover:bg-gh-btn-hover border-gh-btn hover:border-gh-btn-hover')

    else
      classes.push('hover:border-blue-500')
  }

  return classes
})
</script>
