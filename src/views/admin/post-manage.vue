<template>
  <div>
    <p class="mb-4 text-2xl font-bold">
      文章管理
    </p>
    <p>文章总数：{{ postCount }}</p>
    <p>当前页：{{ currentPage }} , 总页数：{{ Math.ceil(postCount / pageSize) }}</p>
    <table class="w-full table-fixed text-center">
      <colgroup>
        <col width="10">
        <col width="700">
        <col width="200">
        <col width="10%">
        <col width="10%">
        <col width="10%">
        <col width="10%">
        <col width="30%">
      </colgroup>
      <tr>
        <th>PID</th>
        <th>标题</th>
        <th>发布者</th>
        <th>点赞数</th>
        <th>评论数</th>
        <th>浏览量</th>
        <th>允许评论</th>
        <th>操作</th>
      </tr>
      <tr v-for="post in postList" :key="post.pid">
        <td>
          <RouterLink :to="`/post/${post.pid}`">
            {{ post.pid }}
          </RouterLink>
        </td>
        <td class="whitespace-nowrap">
          <RouterLink :to="`/post/${post.pid}`">
            {{ post.title }}
          </RouterLink>
        </td>
        <td class="whitespace-nowrap">
          {{ `${post.user.nickname}(${post.user.uid})` }}
        </td>
        <td>{{ post.like }}</td>
        <td>{{ post._count.comments }}</td>
        <td>{{ post.viewCount }}</td>
        <td :class="post.allowComment ? '' : 'text-red-500'">
          {{ post.allowComment ? '是' : '否' }}
        </td>
        <td>
          <CommonButton @click="handleAllowPostComment(post.pid, post.allowComment)">
            {{
              post.allowComment ? '禁止评论'
              : '允许评论'
            }}
          </CommonButton>
          <CommonButton @click="handleDeletePost(post.pid)">
            删除
          </CommonButton>
        </td>
      </tr>
    </table>
    <Pagination :current-page="currentPage" :total-count="postCount" :page-size="pageSize" @change="handlePageChange" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useToast } from 'vue-toastification'
import NProgress from 'nprogress'
import { allowPostComment, deletePost, getPostList, prohibitPostComment } from '@/api/admin'
import { pageSize } from '@/config'
import { useStore } from '@/store'
import type { AdminPostData } from '@/types'

const store = useStore()
const toast = useToast()

const postList = ref<AdminPostData[]>([])
const currentPage = ref(1)
const postCount = ref(0)

onMounted(() => {
  fetchData()
})

function fetchData() {
  NProgress.start()
  postList.value = []
  getPostList(store.token, currentPage.value)
    .then((res: any) => {
      postList.value = res.posts
      postCount.value = res.count
    })
    .catch((err: any) => {
      toast.error(err.message)
    })
    .finally(() => {
      NProgress.done()
    })
}

function handleAllowPostComment(pid: number, curStatus: number) {
  if (curStatus === 1) {
    prohibitPostComment(store.token, pid)
      .then((res: any) => {
        toast.success('禁止评论成功：')
        fetchData()
      })
      .catch((err: any) => {
        toast.error(`禁止评论失败：${err.message}`)
      })
  }
  else {
    allowPostComment(store.token, pid)
      .then((res: any) => {
        toast.success('允许评论成功')
        fetchData()
      })
      .catch((err: any) => {
        toast.error(`允许评论失败：${err.message}`)
      })
  }
}

function handleDeletePost(pid: number) {
  deletePost(store.token, pid)
    .then((res: any) => {
      toast.success('删除文章成功：')
      fetchData()
    })
    .catch((err: any) => {
      toast.error(`删除文章失败：${err.message}`)
    })
}

function handlePageChange(page: number) {
  currentPage.value = page
  fetchData()
}
</script>
