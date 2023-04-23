<template>
  <div>
    <p class="mb-4 text-2xl font-bold">
      发布文章
    </p>
    <div class="w-full">
      <p class="my-2 font-bold">
        标题
      </p>
      <input
        v-model="newPostTitle" class="w-full px-2 py-1 rounded-md border hover:border-blue-500 transition-colors"
        placeholder="有什么新鲜事要向大家分享？" maxlength="30"
      >
      <p class="my-2 font-bold">
        内容
      </p>
      <CommonButton v-if="setting.legacyEditor" v-model="newPostContent" />
      <EditorMarkdown v-else v-model="newPostContent" class="h-[calc(100vh-320px)]" />
      <CommonButton class="mt-2" primary @click="handleNewPost">
        发布
      </CommonButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { marked } from 'marked'
import { ref, toRefs, watchEffect } from 'vue'
import { debounce } from 'lodash'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'
import { useStore } from '@/store'
import { newPost } from '@/api/post'

const store = useStore()
const toast = useToast()
const router = useRouter()

const { setting } = toRefs(store)

const newPostTitle = ref('')
const newPostContent = ref('')
const preview = ref('')

const update = debounce((value) => {
  preview.value = marked.parse(value)
}, 100)

watchEffect(() => {
  update(newPostContent.value)
})

async function handleNewPost() {
  // 发布文章
  if (newPostTitle.value.trim() === '') {
    toast.warning('文章标题不可为空')
    return
  }
  if (newPostContent.value.trim() === '') {
    toast.warning('文章内容不可为空')
    return
  }
  newPost(store.token, newPostTitle.value.trim(), newPostContent.value.trim())
    .then(() => {
      toast.success('发布成功')
      router.push('/admin/mypost')
    })
    .catch((err) => {
      toast.error(`发布失败: ${err}`)
    })
}
</script>
