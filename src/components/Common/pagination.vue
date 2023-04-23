<template>
  <div class="w-full flex justify-center">
    <button
      class="bg-gray-200 flex justify-center items-center px-2 py-1 mr-2 rounded-md hover:text-blue-500 hover:bg-gray-300/70 transition-colors  "
      @click="handleBtnPrev"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
        class="w-4 h-4"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
      </svg>
    </button>
    <div
      v-for="item in pageCount"
      :key="item"
      class="flex justify-center items-center px-2 py-1 mr-2 rounded-md  cursor-pointer  transition-colors " :class="(item === currentPage) ? 'cursor-default bg-blue-500 text-white' : 'bg-gray-200 hover:text-blue-500 hover:bg-gray-300/70'" @click="if (item !== currentPage) emits('change', item);"
    >
      <span class="min-w-[16px] text-center">
        {{ item }}
      </span>
    </div>
    <button
      class="bg-gray-200 flex justify-center items-center px-2 py-1 mr-2 rounded-md hover:text-blue-500 hover:bg-gray-300/70 transition-colors  "
      @click="handleBtnNext"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
        class="w-4 h-4"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  currentPage: number
  totalCount: number
  pageSize: number
}>()

const emits = defineEmits(['change'])

const pageCount = computed(() => Math.ceil(props.totalCount / props.pageSize))

function handleBtnPrev() {
  if (props.currentPage !== 1)
    emits('change', props.currentPage - 1)
}

function handleBtnNext() {
  if (props.currentPage !== pageCount.value)
    emits('change', props.currentPage + 1)
}
</script>
