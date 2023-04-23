<template>
  <div>
    <div class="w-full my-10 flex justify-center" v-if="loading">
      <IconLoading class="w-20 h-20" />
    </div>
    <Transition name="popup-t">
      <div v-show="posts.length !== 0">
        <PostPreview v-for="post in posts" :post-data="post"
        @like-add="handleLikeChange($event, true)"
        @like-reduce="handleLikeChange($event, false)"
         />
      </div>
    </Transition>
    <CommonPagination :current-page="currentPage" :total-count="postCount" :page-size="pageSize" @change="handlePageChange" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { PostData } from '@/types';
import NProgress from 'nprogress'
import { getList } from '@/api/post';
import { pageSize } from '@/constants/config';
import { useStore } from '@/store';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute()
const router = useRouter()

const posts = ref<PostData[]>([])
const currentPage = ref(1)
const postCount = ref(0)
const loading = ref(false)

onMounted(() => {
  if (route.query.page) {
    currentPage.value = Number(route.query.page)
  }
  fetchData()
})

function fetchData() {
  // 获取主页文章数据
  NProgress.start()
  loading.value = true
  posts.value = []
  getList(currentPage.value)
    .then((res: any) => {
      posts.value = res['posts']
      postCount.value = res['count']
    })
    .finally(() => {
      NProgress.done()
      loading.value = false
    })
}

function handlePageChange(page: number) {
  currentPage.value = page
  router.push({ query: { page } })
  fetchData()
}

function handleLikeChange(pid: number, isAdd: boolean) {
  const post = posts.value.find((post) => post.pid === pid)
  if (post) {
    post.like += isAdd ? 1 : -1
  }
}
</script>