<template>
  <div>
    <p class="mb-4 text-2xl font-bold">
      学习章节管理
    </p>
    <div v-for="chapter in chapterList" :key="chapter.id">
      {{ chapter.name }}
    </div>
  </div>
</template>

<script setup lang="ts">
import NProgress from 'nprogress'
import { useToast } from 'vue-toastification'
import { useStore } from '@/store'
import { getChapterData } from '@/api/admin'

const store = useStore()
const toast = useToast()

const chapterList = ref([])

onMounted(() => {
  fetchData()
})

function fetchData() {
  NProgress.start()
  chapterList.value = []
  getChapterData(store.token)
    .then((res: any) => {
      chapterList.value = JSON.parse(res)
    })
    .catch((err: any) => {
      toast.error(err.message)
    })
    .finally(() => {
      NProgress.done()
    })
}
</script>
