<template>
  <div>
    <h2>新文章</h2>
    <p class="my-2 font-bold">
      标题
    </p>
    <input
      v-model="data.title" class="w-full p-2 rounded-md border hover:border-blue-500 transition-colors"
      placeholder="有什么新鲜事要向大家分享？" maxlength="30"
    >
    <p class="my-2 font-bold">
      内容
    </p>
    <EditorNormal v-if="setting.legacyEditor" v-model="data.content" />
    <EditorMarkdown v-else v-model="data.content" class="h-[400px]" />
    <CommonButton class="mt-2" primary @click="$emit('newPost')">
      发布
    </CommonButton>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
import type { NewPostData } from '@/types'
import { useStore } from '@/store'

defineProps<{
  data: NewPostData
}>()

defineEmits(['newPost'])

const store = useStore()

const { setting } = toRefs(store)
</script>
