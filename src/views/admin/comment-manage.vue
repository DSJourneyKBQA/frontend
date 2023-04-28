<template>
  <div>
    <p class="mb-4 text-2xl font-bold">
      评论管理
    </p>
    <p>评论总数：{{ commentCount }}</p>
    <p>当前页：{{ currentPage }} , 总页数：{{ Math.ceil(commentCount / pageSize) }}</p>
    <table class="w-full table-fixed text-center">
      <colgroup>
        <col width="10">
        <col width="700">
        <col width="100">
        <col width="100">
        <col width="20%">
        <col width="10%">
        <col width="10%">
        <col width="10%">
        <col width="30%">
      </colgroup>
      <tr>
        <th>CID</th>
        <th>内容</th>
        <th>发布者</th>
        <th>所在文章</th>
        <th>IP</th>
        <th>回复ID</th>
        <th>状态</th>
        <th>评论时间</th>
        <th>操作</th>
      </tr>
      <tr v-for="comment in commentList" :key="comment.cid">
        <td>
          {{ comment.cid }}
        </td>
        <td class="whitespace-nowrap">
          {{ comment.text }}
        </td>
        <td class="whitespace-nowrap">
          {{ `${comment.user.nickname}(${comment.user.uid})` }}
        </td>
        <td class="whitespace-nowrap">
          <RouterLink :to="`/blog/post/${comment.post.pid}`">
            {{ `${comment.post.title}(${comment.post.pid})` }}
          </RouterLink>
        </td>
        <td>{{ comment.ip }}</td>
        <td>{{ comment.replyTo }}</td>
        <td :class="comment.status === 2 ? 'text-red-500' : ''">
          {{ commentStatusEnum[comment.status] }}
        </td>
        <td class="whitespace-nowrap">
          {{ formatTime(comment.createdAt) }}
        </td>
        <td>
          <CommonButton @click="handleMarkComment(comment.cid, comment.status)">
            {{
              comment.status === 0 ? '标记为违规'
              : '标记为正常'
            }}
          </CommonButton>
          <CommonButton @click="handleDeleteComment(comment.cid)">
            删除
          </CommonButton>
        </td>
      </tr>
    </table>
    <CommonPagination
      :current-page="currentPage" :total-count="commentCount" :page-size="pageSize"
      @change="handlePageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useToast } from 'vue-toastification'
import NProgress from 'nprogress'
import { approveComment, banComment, deleteComment, getCommentList } from '@/api/admin'
import { pageSize } from '@/config'
import { useStore } from '@/store'
import { formatTime } from '@/utils'
import type { AdminCommentData } from '@/types'

const store = useStore()
const toast = useToast()

const commentList = ref<AdminCommentData[]>([])
const currentPage = ref(1)
const commentCount = ref(0)

const commentStatusEnum: {
  [key: number]: string
} = {
  0: '正常',
  2: '违规',
}

onMounted(() => {
  fetchData()
})

function fetchData() {
  NProgress.start()
  commentList.value = []
  getCommentList(store.token, currentPage.value)
    .then((res: any) => {
      commentList.value = res.comments
      commentCount.value = res.count
    })
    .catch((err: any) => {
      toast.error(err.message)
    })
    .finally(() => {
      NProgress.done()
    })
}

function handleMarkComment(cid: number, curStatus: number) {
  if (curStatus === 0) {
    banComment(store.token, cid)
      .then((res: any) => {
        toast.success('标记评论成功')
        fetchData()
      })
      .catch((err: any) => {
        toast.error(`标记评论失败：${err.message}`)
      })
  }
  else {
    approveComment(store.token, cid)
      .then((res: any) => {
        toast.success('标记评论成功')
        fetchData()
      })
      .catch((err: any) => {
        toast.error(`标记评论失败：${err.message}`)
      })
  }
}

function handleDeleteComment(cid: number) {
  deleteComment(store.token, cid)
    .then((res: any) => {
      toast.success('删除评论成功')
      fetchData()
    })
    .catch((err: any) => {
      toast.error(`解禁评论失败：${err.message}`)
    })
}

function handlePageChange(page: number) {
  currentPage.value = page
  fetchData()
}
</script>
