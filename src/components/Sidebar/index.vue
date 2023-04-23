<template>
  <div class="bg-green-200 w-[300px] shadow-md p-4">
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
</template>

<script setup lang="ts">
const props = defineProps<{
  data: any[]
}>()
const emits = defineEmits(['changeChapter'])

const currentChapter = ref('')

const handleChangeChapter = (chapterCode: string, chapterId: number) => {
  currentChapter.value = chapterCode
  emits('changeChapter', chapterId)
}

// const chapterList = ref([
//   '章节1',
//   '章节2',
//   '章节3',
// ])
</script>
