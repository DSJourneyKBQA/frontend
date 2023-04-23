<template>
  <div class="flex justify-center w-full">
    <!-- <SideBarPostTOC :content="postData.text" v-if="postData" /> -->
    <div class="w-full">
      <slot name="loading" />
      <Transition name="popup-t">
        <div class="w-full my-2 overflow-hidden bg-white rounded-md" v-if="postData">
          <div class="px-8 pt-4">
            <p class="text-3xl leading-[60px] font-bold">{{ postData.title }}</p>
          </div>
          <div class="flex px-8 py-2 bg-gray-300/20">
            <RouterLink :to="'/user/' + postData.user.uid">
              <img class="w-12 h-12 mr-4 rounded-full" :src="postData.user.avatar" alt="avatar">
            </RouterLink>
            <div class="flex flex-col">
              <RouterLink :to="'/user/' + postData.user.uid">
                <span class="mt-2 text-lg font-bold">{{ postData.user.nickname }}</span>
              </RouterLink>
              <div class="flex items-center text-sm text-gray-500">
                <span>发布于 {{ formatTime(postData.createdAt) }}</span>
                <IconView class="inline-block w-4 h-4 ml-2 mr-1" />
                <span>{{ postData.viewCount }}</span>
                <IconComment class="inline-block w-4 h-4 ml-2 mr-1" />
                <span>{{ commentData.length }}</span>
                <IconLikeOutline class="inline-block w-4 h-4 ml-2 mr-1" />
                <span>{{ postData.like }}</span>
              </div>
            </div>
          </div>
          <!-- 文章内容 -->
          <div class="p-8 pt-4">
            <div class="leading-relaxed rendered" v-html="renderMarkdown(postData.text)"></div>
          </div>
          <div class="flex justify-center py-6">
            <button
              class="flex flex-col items-center justify-center w-16 h-16 transition-colors border-2 border-gray-200 rounded-full hover:bg-gray-200"
              @click="handleLike">
              <IconLikeSolid v-if="likeStatus" class="w-6 h-6 text-red-500" />
              <IconLikeOutline v-else class="w-6 h-6 text-gray-500" />
              <span class="leading-4">{{ postData.like }}</span>
            </button>
          </div>
        </div>
      </Transition>
      <div class="w-full px-4 pt-2 pb-8 my-2 overflow-hidden bg-white rounded-md" id="comment">
        <h2>评论区</h2>
        <div>
          <div class="mb-2" v-if="replyTo !== 0">
            回复 {{ commentData.find((item) => item.cid === replyTo)?.user.nickname }}
          </div>
          <textarea class="w-full p-2 border rounded-md resize-none" v-model="newCommentContent"
            :placeholder="allowComment ? '发一条友善的评论' : '评论区已关闭'" :disabled="!(allowComment && login)"
            @input="resetHeight($event.target as HTMLTextAreaElement)"></textarea>
          <CommonButton class="mr-2" primary @click="handleNewComment" v-if="login && allowComment">{{ replyTo === 0 ?
            '发布'
            : '回复'
          }}
          </CommonButton>
          <CommonButton class="mr-2" v-if="replyTo !== 0" @click="replyTo = 0">取消回复</CommonButton>
        </div>
        <p class="mb-4 text-center" v-if="!login">登录后才可发表评论 <RouterLink to="/login" class="text-blue-800">
            去登录</RouterLink>
        </p>
        <p class="text-center" v-if="commentData.length === 0">暂无评论</p>
        <div class="p-1 mt-4">
          <div class="flex py-2 my-2" v-for="comment in commentData" :id="'comment-' + comment.cid">
            <div class="shrink-0">
              <RouterLink :to="'/user/' + comment.user.uid">
                <img class="w-12 h-12 rounded-full" :src="comment.user.avatar">
              </RouterLink>
              <button class="w-12 text-sm text-center" v-if="login && allowComment"
                @click="replyTo = comment.cid">回复</button>
            </div>
            <div class="flex-1 ml-2">
              <div>
                <span class="font-bold"> {{ comment.user.nickname }}</span>
                <span v-if="postData?.author === comment.user.uid"
                  class="ml-1 text-sm bg-blue-300 px-1 py-0.5 rounded-md">文章作者</span>
              </div>
              <template v-if="comment.replyTo">
                <PostCommentReply :comment="commentData.find((item) => item.cid === comment.replyTo)"
                  @to-comment="handleToComment" @no-comment="toast.warning('评论不存在或已被屏蔽')" />
              </template>
              <div>{{ comment.text }}</div>
              <div class="mt-2 text-sm text-gray-500">{{ formatTime(comment.createdAt) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, toRefs, nextTick, computed } from 'vue';
import { CommentData, PostDetailData } from '@/types';
import { useRoute } from 'vue-router';
import { formatTime, renderMarkdown } from '@/utils';
import NProgress from 'nprogress'
import { useStore } from '@/store';
import { useToast } from 'vue-toastification';
import { cancelLike, getComment, getPost, newComment, submitLike } from '@/api/post';

const store = useStore()
const route = useRoute()
const toast = useToast()

const { pid } = route.params
const { navigate } = route.query
const { login, likeCache } = toRefs(store)
const postData = ref<PostDetailData>()
const commentData = ref<CommentData[]>([])
const newCommentContent = ref('')
const replyTo = ref(0)
const likeStatus = ref(false)

const allowComment = computed(() => postData.value && postData.value.allowComment === 1)

if (login.value) {
  likeStatus.value = likeCache.value.POST.includes(String(pid))
}

onMounted(() => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
  fetchData()
    .then(() => {
      if (navigate) {
        switch (navigate) {
          case 'comments':
            nextTick(() => {
              window.scrollTo({
                top: (document.getElementById('comment')?.getBoundingClientRect().top as number) - 65,
                behavior: 'smooth'
              });
            })
            break;
        }
      }
    })
})

async function fetchData() {
  // 获取文章数据
  NProgress.start()
  store.pageLoading = true
  const postDataPromise = getPost(Number(pid))
  const commentDataPromise = getComment(Number(pid))
  return Promise
    .all([
      postDataPromise,
      commentDataPromise,
    ])
    .then(([post, comment]) => {
      postData.value = post['post']
      commentData.value = comment['comments']
      document.title = postData.value?.title + ' - ' + postData.value?.user.nickname + ' - Ori博客'
    })
    .catch(err => {
      toast.error(err.message)
    })
    .finally(() => {
      NProgress.done()
      store.pageLoading = false
    })
}

function handleLike() {
  // 点赞
  if (!login.value) {
    toast.warning('请先登录')
    return
  }
  if (!likeStatus.value) {
    submitLike(store.token, 'POST', Number(pid))
      .then((result) => {
        likeStatus.value = !likeStatus.value
        postData.value && (postData.value.like += 1)
      })
      .catch((err) => {
        likeStatus.value = !likeStatus.value
        toast('点赞失败：' + err.message)
      })
      .finally(() => {
        likeCache.value.POST.push(String(pid))
      })
  } else {
    cancelLike(store.token, 'POST', Number(pid))
      .then((result) => {
        likeStatus.value = !likeStatus.value
        postData.value && (postData.value.like -= 1)
      })
      .catch((err) => {
        toast('取消点赞失败：' + err.message)
      })
      .finally(() => {
        let exist = likeCache.value.POST.indexOf(String(pid))
        if (exist !== -1) {
          likeCache.value.POST.splice(exist, 1)
        }
      })
  }
}

function handleNewComment() {
  // 提交评论
  if (newCommentContent.value.trim() == '') {
    toast.warning('评论内容不可为空')
    return
  }
  if (replyTo.value === 0) {
    newComment(store.token, Number(pid), newCommentContent.value.trim(), navigator.userAgent)
      .then(async (result) => {
        toast.success('评论发布成功')
        newCommentContent.value = ''
        commentData.value = (await getComment(Number(pid)))['comments']
      })
      .catch((err) => {
        toast.error('评论发布失败：' + err)
      });
  } else {
    newComment(store.token, Number(pid), newCommentContent.value.trim(), navigator.userAgent, replyTo.value)
      .then(async (result) => {
        toast.success('评论回复成功')
        newCommentContent.value = ''
        commentData.value = (await getComment(Number(pid)))['comments']
        replyTo.value = 0
      })
      .catch((err) => {
        toast.error('评论回复失败：' + err)
      });
  }
}

function handleToComment(cid: number) {
  // 跳转到评论
  let comment = document.getElementById('comment-' + cid)
  if (comment) {
    comment.scrollIntoView({ behavior: 'smooth', block: 'center' })
    setTimeout(() => {
      comment?.classList.add('animate-twinkle')
    }, 200)

    setTimeout(() => {
      comment?.classList.remove('animate-twinkle')
    }, 2200)
  }
}

function resetHeight(e: HTMLTextAreaElement) {
  e.style.height = '100px'
  nextTick(() => {
    e.style.height = e.scrollHeight + 'px'
  });
}
</script>

<style>
code.hljs {
  @apply rounded-xl leading-normal;
}

.rendered img {
  @apply max-w-full rounded-xl;
}

.rendered>* {
  @apply my-2;
}
</style>
