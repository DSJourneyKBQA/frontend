<template>
  <div
    class="cursor-pointer hover:bg-white/20 w-fit p-1 absolute border transition-colors z-10"
    :class="{
      'border-white/60': select,
      'border-transparent': !select,
    }"
    :style="{
      transform: `translate(${position.x * 20}px, ${position.y * 20}px)`,
    }"
    @mousedown.prevent.stop="$emit('dragStart', index, $event)"
    @click.stop="$emit('select', index)"
  >
    <IconDynamic :type="type" class="w-8 h-8 text-white" />
  </div>
</template>

<script setup lang="ts">
import type { ItemType } from '@/enums'

defineProps<{
  index: number
  type: ItemType
  position: {
    x: number
    y: number
  }
  select: boolean
}>()
defineEmits(['dragStart', 'select'])
</script>
