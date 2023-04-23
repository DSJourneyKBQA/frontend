<template>
  <div
    class="w-full mb-1 px-2 py-1.5 font-semibold active:scale-95 transition-all rounded-md cursor-pointer"
    :class="active ? 'text-blue-700/90 bg-[#e1f0ff]' : 'hover:bg-black/10'"
  >
    {{ data.display }}
  </div>
</template>

<script setup lang="ts">
defineProps<{
  data: {
    name: string
    to: string
    display: string
  }
  active: boolean
}>()
</script>
