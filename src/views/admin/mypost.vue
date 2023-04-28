<template>
  <div>
    <p class="mb-4 text-2xl font-bold">
      我的文章
    </p>
    <div v-if="postList.length === 0" class="text-center pb-4">
      <span>这里还什么都没有呢</span>
    </div>
    <template v-else>
      <table class="w-full table-fixed text-center">
        <colgroup>
          <col width="700">
          <col width="10%">
          <col width="10%">
          <col width="30%">
        </colgroup>
        <tr>
          <th>标题</th>
          <th>浏览量</th>
          <th>评论数</th>
          <th>操作</th>
        </tr>
        <tr v-for="post in postList" :key="post.pid">
          <td class="whitespace-nowrap overflow-ellipsis">
            <RouterLink :to="`/blog/post/${post.pid}`">
              {{ post.title }}
            </RouterLink>
          </td>
          <td>{{ post.viewCount }}</td>
          <td>{{ post._count.comments }}</td>
          <td>
            <RouterLink :to="`/blog/post/edit/${post.pid}`">
              <CommonButton>编辑</CommonButton>
            </RouterLink>
            <CommonButton class="ml-2" @click="handlePostDelete(post.pid)">
              删除
            </CommonButton>
          </td>
        </tr>
      </table>
      <CommonPagination
        :current-page="currentPage" :total-count="postCount" :page-size="pageSize"
        @change="handlePageChange"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { useToast } from 'vue-toastification'
import NProgress from 'nprogress'
import { onMounted, ref } from 'vue'
import { useStore } from '@/store'
import { deletePost, getList } from '@/api/post'
import type { PostData } from '@/types'
import { pageSize } from '@/config'

const store = useStore()
const toast = useToast()

const postList = ref<PostData[]>([])
const currentPage = ref(1)
const postCount = ref(0)

onMounted(() => {
  fetchData()
})

function fetchData() {
  NProgress.start()
  postList.value = []
  getList(currentPage.value, store.uid)
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

function handlePostDelete(postId: number) {
  deletePost(store.token, postId)
    .then(() => {
      toast.success('删除成功')
      fetchData()
    })
    .catch((err) => {
      toast.error(`删除失败：${err.message}`)
    })
}

function handlePageChange(page: number) {
  currentPage.value = page
  fetchData()
}
</script>
