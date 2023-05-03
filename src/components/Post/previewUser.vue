<template>
  <div class="w-full bg-gh-card my-2 rounded-[12px] overflow-hidden border border-github">
    <div class="flex pt-6 px-4">
      <div class="w-full flex flex-row justify-between">
        <div class="text-gray-500 flex items-center">
          <span>发布于：{{ formatTime(postData.createdAt) }}</span>
          <IconView class="w-4 h-4 inline-block ml-2 mr-1" />
          <span>{{ postData.viewCount }}</span>
        </div>
        <div v-if="editMode">
          <RouterLink class="mr-1" :to="`/blog/post/edit/${postData.pid}`">
            <CommonButton dark>
              编辑
            </CommonButton>
          </RouterLink>
          <CommonButton dark @click="emits('delete', postData.pid)">
            删除
          </CommonButton>
        </div>
      </div>
    </div>
    <RouterLink :to="`/blog/post/${postData.pid}`">
      <div class="pl-4 pr-8">
        <p class="text-2xl leading-[60px]">
          {{ postData.title }}
        </p>
        <p class="">
          {{ postData.text }}
        </p>
      </div>
    </RouterLink>
    <div class="flex h-10 mt-4">
      <RouterLink class="flex-1" :to="{ path: `/blog/post/${postData.pid}`, query: { navigate: 'comments' } }">
        <div class="h-full flex items-center justify-center hover:bg-gray-500/10 transition-colors">
          <IconComment class="w-5 h-5 inline-block mr-1" />
          <span>{{ postData._count.comments }}</span>
        </div>
      </RouterLink>
      <div class="flex-1 flex items-center justify-center hover:bg-gray-500/10 transition-colors">
        <IconLikeOutline class="w-5 h-5 inline-block mr-1" />
        <span>{{ postData.like }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatTime } from '@/utils'
import type { PostData } from '@/types'

defineProps<{
  postData: PostData
  editMode: boolean
}>()

const emits = defineEmits(['delete'])
</script>
