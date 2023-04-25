<template>
  <div
    class="shadow-md relative transition-[width] bg-white"
    :class="{
      'w-0': !showSidebar,
      'w-[300px]': showSidebar,
    }"
  >
    <div
      class="absolute w-[40px] top-2 right-[-40px] shadow-md p-2 rounded-r-lg bg-white cursor-pointer"
      @click="showSidebar = !showSidebar"
    >
      <IconArrowLeft v-if="showSidebar" class="w-6 h-6" />
      <IconArrowRight v-else class="w-6 h-6" />
    </div>
    <div class="w-[300px] h-full p-4 absolute right-0 top-0 overflow-y-auto">
      <h2 class="text-2xl font-bold">
        学习目录
      </h2>
      <div
        v-for="chapter, idx in data" :key="chapter.name"
        class="my-1"
      >
        <div
          class="text-lg"
          :class="{
            'text-blue-500': currentChapter === String(idx),
            'text-black': currentChapter !== String(idx),
          }"
          @click="handleChangeChapter(`${idx}`, chapter.id)"
        >
          {{ chapter.name }}
        </div>
        <div
          v-for="child, cidx in chapter.children" :key="child.name"
          class="pl-4"
          :class="{
            'text-blue-500': currentChapter === `${idx}_${cidx}`,
            'text-black': currentChapter !== `${idx}_${cidx}`,
          }"
          @click="handleChangeChapter(`${idx}_${cidx}`, child.id)"
        >
          {{ child.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ChapterData } from '@/types'

defineProps<{
  data: ChapterData[]
}>()
const emits = defineEmits(['changeChapter'])

const currentChapter = ref('')

const showSidebar = ref(true)

const handleChangeChapter = (chapterCode: string, chapterId: number) => {
  if (chapterId === -1)
    return

  currentChapter.value = chapterCode
  emits('changeChapter', chapterId)
}
</script>
