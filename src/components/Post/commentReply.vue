<template>
  <div class="bg-gray-300/50 w-full px-4 py-2 rounded-md my-2 cursor-pointer" @click="navigateToComment">
    <div v-if="comment">
      <div>{{ `${comment.user.nickname}：${comment.text}` }}</div>
      <div class="mt-2 text-sm text-gray-500">
        {{ formatTime(comment.createdAt) }}
      </div>
    </div>
    <div v-else>
      评论不存在或已被屏蔽
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CommentData } from '@/types'
import { formatTime } from '@/utils'

const props = defineProps<{
  comment: CommentData | undefined
}>()

const emits = defineEmits(['toComment', 'noComment'])

function navigateToComment() {
  if (props.comment)
    emits('toComment', props.comment.cid)

  else
    emits('noComment')
}
</script>
