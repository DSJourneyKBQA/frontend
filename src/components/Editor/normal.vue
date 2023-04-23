<template>
  <textarea
    class="w-full min-h-[100px] p-2 rounded-md border hover:border-blue-500 transition-colors overflow-y-hidden"
    :class="setting.stickyTextarea ? 'h-[300px] overflow-y-scroll' : ''" :value="modelValue"
    @input="handleInput($event.target as HTMLTextAreaElement)"
  />
</template>

<script setup lang="ts">
import { nextTick, toRefs } from 'vue'
import { useStore } from '@/store'

defineProps<{
  modelValue: string
}>()
const emits = defineEmits(['update:modelValue'])

const store = useStore()

const { setting } = toRefs(store)

function handleInput(ele: HTMLTextAreaElement) {
  emits('update:modelValue', ele.value)
  if (setting.value.stickyTextarea)
    return
  ele.style.height = '100px'
  nextTick(() => {
    ele.style.height = `${ele.scrollHeight}px`
  })
}
</script>
