<template>
  <div class="flex h-[calc(100vh-60px)] ">
    <Sidebar :data="chapters" @change-chapter="handleChangeChapter" />
    <div class="flex-1 p-4 h-full overflow-y-auto">
      <div v-if="chapterContent" class="px-8">
        <h2 class="text-3xl">
          {{ chapterContent.title }}
        </h2>
        <div class="text-xl font-light">
          {{ chapterContent.description }}
        </div>
        <div class="rendered" v-html="renderMarkdown(chapterContent.content)" />
      </div>
      <div v-else class="text-center">
        请选择章节
      </div>
    </div>
    <div class="flex-1 h-full flex flex-col border-l">
      <div class="h-[60%]">
        <textarea class="w-full h-full resize-none outline-none p-2" />
      </div>
      <div class="h-[40%] border-t">
        <textarea class="w-full h-full resize-none outline-none p-2" />
      </div>
    </div>
  </div>
</template>

<script setup  lang="ts">
import NProgress from 'nprogress'
import { getChapterContent, getChapterList } from '@/api/study'
import { useStore } from '@/store'
import type { ChapterContentData, ChapterData } from '@/types'
import { renderMarkdown } from '@/utils'

const store = useStore()

const chapters = ref<ChapterData[]>([])
const chapterContent = ref<ChapterContentData>()

onMounted(async () => {
  fetchData()
})

function fetchData() {
  NProgress.start()
  getChapterList(store.token, store.uid)
    .then((res: any) => {
      chapters.value = handleChapterData(res)
    }).finally(() => {
      NProgress.done()
    })
}

function handleChapterData(data: any): ChapterData[] {
  const chapters = data.chapterData
  const userStatus = data.userData
  chapters.forEach((chapter: any) => {
    chapter.status = true
    chapter.children.forEach((ele: any) => {
      const status = userStatus.find((v: any) =>
        v.id === ele.id,
      )
      if (status) {
        ele.status = true
        ele.score = status.score
      }
      else {
        chapter.status = false
        ele.status = false
        ele.score = 0
      }
    })
  })
  return chapters
}

async function handleChangeChapter(chapterId: number) {
  if (chapterId === -1)
    return
  chapterContent.value = await getChapterContent(chapterId)
}
</script>

<style>
code.hljs {
  @apply rounded-xl leading-normal my-3;
}

.rendered img {
  @apply max-w-full rounded-xl;
}

.rendered>* {
  @apply my-2;
}
</style>
