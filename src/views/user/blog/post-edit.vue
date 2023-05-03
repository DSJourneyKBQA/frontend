<template>
  <div class="w-full lg:w-[700px] xl:w-[1024px] mx-auto py-4">
    <div class="w-full bg-gh-card my-2 rounded-md overflow-hidden shadow-sm px-4 pt-2 pb-4">
      <h2>编辑文章</h2>
      <slot name="loading" />
      <div v-if="postData">
        <p class="my-2 font-bold">
          标题
        </p>
        <input
          v-model="postData.title" class="w-full p-2 rounded-md bg-github border border-github transition-colors"
          type="text"
        >
        <p class="my-2 font-bold">
          内容
        </p>
        <EditorNormal v-if="setting.legacyEditor" v-model="postData.text" />
        <EditorMarkdown v-else v-model="postData.text" dark class="!h-[calc(100vh-400px)]" />
        <div class="mt-2">
          <CommonButton primary dark @click="handleSavePost">
            保存修改
          </CommonButton>
          <CommonButton dark @click="router.back()">
            取消
          </CommonButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, toRefs } from 'vue'
import { useRoute } from 'vue-router'
import NProgress from 'nprogress'
import { useToast } from 'vue-toastification'
import type { PostDetailData } from '@/types'
import { editPost, getPost } from '@/api/post'
import { useStore } from '@/store'
import router from '@/router'

const store = useStore()
const route = useRoute()
const toast = useToast()

const { login, uid, setting } = toRefs(store)
const pid = ref(String(route.params.pid))
const postData = ref<PostDetailData | null>(null)
const eleTextarea = ref<HTMLTextAreaElement | null>(null)

onMounted(async () => {
  if (!login.value) {
    toast.warning('请先登录')
    router.push('/login')
    return
  }
  NProgress.start()
  await fetchData()
  NProgress.done()
})

async function fetchData() {
  // 获取文章数据
  store.pageLoading = true
  getPost(Number(pid.value))
    .then((result: any) => {
      postData.value = result.post
      if (uid.value !== postData.value?.author) {
        toast.warning('你没有权限编辑此文章')
        router.push('/user')
      }
    })
    .catch(() => {
      toast.error('获取文章数据失败')
      router.push('/user')
    })
    .finally(() => {
      store.pageLoading = false
    })
}

async function handleSavePost() {
  if (postData.value?.title.trim() === '') {
    toast.warning('文章标题不可为空')
    return
  }
  if (postData.value?.text.trim() === '') {
    toast.warning('文章内容不可为空')
    return
  }
  if (postData.value) {
    editPost(store.token, postData.value.pid, postData.value.title.trim(), postData.value.text.trim())
      .then((res) => {
        toast.success('保存成功')
        router.back()
      })
      .catch((err) => {
        toast.error(`保存失败：${err.message}`)
      })
  }
}
</script>
