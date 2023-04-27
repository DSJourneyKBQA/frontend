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
    <IconDynamic
      :type="type" class="w-8 h-8 transition-transform duration-150"
      :class="{
        'text-white': status === 0,
        'text-green-500': status === 1,
        'text-red-500': status === 2,
        'text-green-500 scale-[120%]': status === 3,
        'text-[#92e251]': status === 4,
      }"
    />
  </div>
</template>

<script setup lang="ts">
import type { ItemType } from '@/enums'

defineProps<{
  index: number
  type: ItemType
  status: 0 | 1 | 2 | 3 | 4 // 0:未开启 1:正常 2:异常 3:收到心跳
  position: {
    x: number
    y: number
  }
  select: boolean
}>()
defineEmits(['dragStart', 'select'])
</script>
