<template>
  <div
    class="cursor-pointer hover:bg-white/20 w-full py-4 flex items-center justify-center"
    @mousedown.prevent.stop="$emit('dragStart')"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
defineEmits(['dragStart', 'select'])
</script>
