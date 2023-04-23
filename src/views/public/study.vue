<template>
  <div class="flex h-[calc(100vh-60px)] bg-red-200">
    <Sidebar :data="chapters" @change-chapter="handleChangeChapter" />
    <div class="flex-1 bg-blue-200 p-4 h-full overflow-y-auto">
      {{ chapterContent.content }}
    </div>
  </div>
</template>

<script setup  lang="ts">
const chapters = ref([])
const chapterContent = ref({
  content: '',
})

onMounted(async () => {
  // chapters.value = await getChapterList()
})

async function getChapterList() {
  const res = await fetch('http://localhost:3000/study/getChapterList', {
    method: 'POST',
  })
  const data = (await res.json()).data
  const chapters = data.chapterData
  chapters.forEach((ele: any) => {
    handleChapterStatus(ele, data.userData)
  })
  return chapters
}

async function getChapterContent(chapterId: number) {
  const res = await fetch(`http://localhost:3000/study/getChapterContent?id=${chapterId}`)
  const data = (await res.json()).data
  return data
}

function handleChapterStatus(chapter: any, userStatus: any) {
  if (!chapter.children)
    return
  chapter.children.forEach((ele: any) => {
    const status = userStatus.find((v: any) =>
      v.id === ele.id,
    )
    if (status) {
      ele.status = true
      ele.score = status.score
    }
    else {
      ele.status = false
      ele.score = 0
    }
    handleChapterStatus(ele, userStatus)
  })
}

async function handleChangeChapter(chapterId: number) {
  if (chapterId === -1)
    return
  chapterContent.value = await getChapterContent(chapterId)
}
</script>
