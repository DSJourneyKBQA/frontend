<template>
  <div class="w-full bg-white my-2 rounded-md overflow-hidden shadow-sm">
    <div class="flex pt-6 px-4">
      <RouterLink :to="`/user/${postData.user.uid}`">
        <img
          class="rounded-full w-16 h-16 mr-4 hover:scale-[1.1] transition-transform" :src="postData.user.avatar"
          alt="avatar"
        >
      </RouterLink>
      <div class="flex flex-col">
        <RouterLink :to="`/user/${postData.user.uid}`">
          <span class="mt-2 text-lg font-bold">{{ postData.user.nickname }}</span>
        </RouterLink>
        <div class="text-gray-500 flex items-center text-sm">
          <span>{{ formatTime(postData.createdAt) }}</span>
          <IconView class="w-4 h-4 inline-block ml-2 mr-1" />
          <span>{{ postData.viewCount }}</span>
        </div>
      </div>
    </div>
    <RouterLink :to="`/blog/post/${postData.pid}`">
      <div class="lg:ml-[80px] lg:pl-4 px-8">
        <p class="text-2xl leading-[60px]">
          {{ postData.title }}
        </p>
        <p class="">
          {{ postData.text }}
        </p>
      </div>
    </RouterLink>
    <div class="flex h-10 mt-4">
      <RouterLink class="flex-1" :to="{ path: `blog/post/${postData.pid}`, query: { navigate: 'comments' } }">
        <div class="h-full flex items-center justify-center hover:bg-gray-500/10 transition-colors">
          <IconComment class="w-5 h-5 inline-block mr-1" />
          <span>{{ postData._count.comments }}</span>
        </div>
      </RouterLink>
      <button
        class="flex-1 flex items-center justify-center hover:bg-gray-500/10 transition-colors"
        @click="btnClickLike"
      >
        <IconLikeSolid v-if="likeStatus" class="w-5 h-5 inline-block mr-1 text-red-500" />
        <IconLikeOutline v-else class="w-5 h-5 inline-block mr-1" />
        <span>{{ postData.like }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs } from 'vue'
import { useToast } from 'vue-toastification'
import { useStore } from '@/store'
import { formatTime } from '@/utils'
import type { PostData } from '@/types'
import { cancelLike, submitLike } from '@/api/post'

const props = defineProps<{
  postData: PostData
}>()

const emits = defineEmits(['likeAdd', 'likeReduce'])

const store = useStore()
const toast = useToast()

const { login, likeCache } = toRefs(store)
const likeStatus = ref(false)

if (login.value)
  likeStatus.value = likeCache.value.POST.includes(props.postData.pid.toString())

function btnClickLike() {
  if (!login.value) {
    toast.warning('请先登录')
    return
  }
  if (!likeStatus.value) {
    submitLike(store.token, 'POST', props.postData.pid)
      .then(() => {
        likeStatus.value = !likeStatus.value
        emits('likeAdd', props.postData.pid)
      })
      .catch((err) => {
        likeStatus.value = !likeStatus.value
        toast(`点赞失败：${err.message}`)
      })
      .finally(() => {
        likeCache.value.POST.push(props.postData.pid.toString())
      })
  }
  else {
    cancelLike(store.token, 'POST', props.postData.pid)
      .then(() => {
        likeStatus.value = !likeStatus.value
        emits('likeReduce', props.postData.pid)
      })
      .catch((err) => {
        toast(`取消点赞失败：${err.message}`)
      })
      .finally(() => {
        const exist = likeCache.value.POST.indexOf(props.postData.pid.toString())
        if (exist !== -1)
          likeCache.value.POST.splice(exist, 1)
      })
  }
}
</script>
