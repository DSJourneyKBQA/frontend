<template>
  <div
    class="cursor-pointer hover:bg-white/20 w-full py-4 flex items-center justify-center relative"
    @mouseenter="showTip = true"
    @mouseleave="showTip = false"
    @mousedown.prevent.stop="$emit('dragStart'); showTip = false"
  >
    <TryToolBarTip v-show="showTip" class="absolute left-[68px] z-20">
      {{ title }}
    </TryToolBarTip>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
}>()
defineEmits(['dragStart', 'select'])

const showTip = ref(false)
</script>
