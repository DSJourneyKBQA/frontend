<template>
  <div class="flex h-[calc(100vh-60px)] ">
    <Sidebar :data="chapters" @change-chapter="handleChangeChapter" />
    <div class="flex-1 p-4 h-full overflow-y-auto">
  <div  v-if="chapterContent">
        {{ chapterContent.content }}
      </div>
      <div v-else class="text-center">
        请选择章节
      </div>
    </div>
    
  </div>
</template>

<script setup  lang="ts">
import { getChapterList } from '@/api/study'
import { useStore } from '@/store'
import NProgress from 'nprogress'
import type { ChapterData,ChapterContentData } from '@/types'

const store = useStore()

const chapters = ref<ChapterData[]>([])
const chapterContent = ref<ChapterContentData>()

onMounted(async () => {
  fetchData()
})

function fetchData(){
  NProgress.start()
  getChapterList(store.token,store.uid)
  .then((res: any) => {
    chapters.value = handleChapterData(res)
  }).finally(() => {
    NProgress.done()
  })
}

function handleChapterData(data:any) : ChapterData[] {
  const chapters = data['chapterData']
  const userStatus = data['userData']
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
        chapter.status= false
        ele.status = false
        ele.score = 0
      }
    })
    
  })
  return chapters
}

async function getChapterContent(chapterId: number) {
  const res = await fetch(`http://localhost:3000/study/getChapterContent?id=${chapterId}`)
  const data = (await res.json()).data
  return data
}

async function handleChangeChapter(chapterId: number) {
  if (chapterId === -1)
    return
  chapterContent.value = await getChapterContent(chapterId)
}
</script>
