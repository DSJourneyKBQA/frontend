<template>
  <div class="w-full lg:w-[700px] xl:w-[1024px] mx-auto py-4">
    <div class="w-full bg-gh-card border border-github my-2 rounded-md overflow-hidden shadow-sm px-4 pt-2 pb-4 relative">
      <div v-if="enableEditMode" class="absolute top-4 right-4">
        <CommonButton dark @click="handleGoAdmin">
          进入后台
        </CommonButton>
        <CommonButton dark class="ml-1" @click="handleLogout">
          退出登录
        </CommonButton>
      </div>
      <h2>{{ enableEditMode ? '我的' : '用户' }}信息</h2>
      <slot name="loading" />
      <template v-if="!userProfile">
        <div class="text-center">
          加载中
        </div>
      </template>
      <template v-else>
        <div class="flex flex-col w-full items-center">
          <img class="rounded-full w-[120px] h-[120px] shadow-md" :src="userProfile?.avatar" alt="user avatar">
          <span class="font-bold mt-4">{{ userProfile?.nickname }}</span>
          <span class="text-gray-500">@{{ userProfile?.name }}</span>
          <div class="mt-2">
            <span class="mr-2 text-sm bg-yellow-300/50 px-1 py-0.5 rounded-md text-white">uid:{{ userProfile?.uid }}</span>
            <span class="mr-2 text-sm bg-red-300/50 px-1 py-0.5 rounded-md text-white">用户组:{{ userProfile?.role }}</span>
            <span
              v-if="userProfile.status !== 0"
              class="mr-2 text-sm bg-red-500 px-1 py-0.5 rounded-md text-white"
            >用户已被封禁</span>
          </div>
        </div>
      </template>
    </div>
    <div v-if="enableEditMode" class="w-full bg-gh-card border border-github my-2 rounded-md overflow-hidden shadow-sm px-4 pt-2 pb-4">
      <PostNew :data="newPostParams" @new-post="handleNewPost" />
    </div>
    <div class="w-full bg-gh-card border border-github my-2 rounded-md overflow-hidden shadow-sm px-4 pt-2 pb-2">
      <h2>{{ enableEditMode ? '我的' : '用户' }}文章</h2>
      <div v-if="userPosts.length === 0" class="text-center pb-4">
        <span>这里还什么都没有呢</span>
      </div>
      <template v-else>
        <PostPreviewUser
          v-for="post in userPosts" :key="post.pid"
          :post-data="post" :edit-mode="enableEditMode"
          @delete="handleDeletePost"
        />
        <CommonPagination
          dark
          :current-page="currentPage" :total-count="postCount" :page-size="pageSize"
          @change="handlePageChange"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, toRefs, watchEffect } from 'vue'
import { useToast } from 'vue-toastification'
import { useRoute, useRouter } from 'vue-router'
import NProgress from 'nprogress'
import { pageSize } from '@/config'
import { useStore } from '@/store'
import { getInfo } from '@/api/user'
import type { NewPostData, PostData, UserProfile } from '@/types'
import { deletePost, getList, newPost } from '@/api/post'

const store = useStore()
const route = useRoute()
const router = useRouter()
const toast = useToast()

const { login } = toRefs(store)
const { params } = toRefs(route)
const userId = ref(String(route.params.uid))
const userProfile = ref<UserProfile | null>()
const userPosts = ref<PostData[]>([])
const newPostParams = ref<NewPostData>({ title: '', content: '' })
const currentPage = ref(1)
const postCount = ref(0)

const enableEditMode = computed(() => login.value && userId.value === String(store.uid))

watchEffect(() => {
  if (params.value.uid) {
    // to.params.uid 可能为 undefined
    userId.value = String(params.value.uid)
    fetchData()
  }
})

onMounted(() => {
  if (route.query.page)
    currentPage.value = Number(route.query.page)

  fetchData()
})

// 获取数据
async function fetchData() {
  // 获取用户数据
  NProgress.start()
  store.pageLoading = true
  const userProfilePromise = getInfo(Number(userId.value))
  const userPostsPromise = getList(currentPage.value, Number(userId.value))
  return Promise
    .all([
      userProfilePromise,
      userPostsPromise,
    ])
    .then(([profile, posts]) => {
      userProfile.value = profile.userInfo
      userPosts.value = posts.posts
      postCount.value = posts.count
      document.title = `${userProfile.value?.nickname}的主页 - 分布式体验与学习平台`
    })
    .catch((err) => {
      toast.error(err.message)
    })
    .finally(() => {
      NProgress.done()
      store.pageLoading = false
    })
}

async function handleNewPost() {
  // 发布文章
  if (newPostParams.value.title.trim() === '') {
    toast.warning('文章标题不可为空')
    return
  }
  if (newPostParams.value.content.trim() === '') {
    toast.warning('文章内容不可为空')
    return
  }
  newPost(store.token, newPostParams.value.title.trim(), newPostParams.value.content.trim())
    .then((res) => {
      toast.success('发布成功')
      newPostParams.value.title = ''
      newPostParams.value.content = ''
      fetchData()
    })
    .catch((err) => {
      toast.error(`发布失败: ${err}`)
    })
}

async function handleDeletePost(pid: number) {
  // 删除文章
  deletePost(store.token, pid)
    .then((res) => {
      toast.success('删除成功')
      fetchData()
    })
    .catch((err) => {
      toast.error(`删除失败: ${err.message}`)
    })
}

function handleGoAdmin() {
  router.push('/admin')
}

function handleLogout() {
  // 清除登录信息
  localStorage.removeItem('uid')
  localStorage.removeItem('token')
  localStorage.removeItem('likeCache')
  store.login = false
  store.uid = 0
  store.token = ''
}

function handlePageChange(page: number) {
  // 切换文章
  currentPage.value = page
  router.push({ query: { page } })
  fetchData()
}
</script>
