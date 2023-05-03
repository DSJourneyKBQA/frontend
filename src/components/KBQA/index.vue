<template>
  <div class="w-full h-full flex flex-col">
    <div class="flex justify-between">
      <p class="font-bold text-xl">
        智能问答
      </p>
      <IconClose class="w-5 h-5 cursor-pointer" @click.stop="$emit('close')" />
    </div>
    <div
      ref="msgContainer"
      class="bg-github flex-1 mt-2 mb-4 rounded-lg p-2 border border-github overflow-y-auto"
    >
      <template v-for="msg in msgList">
        <div v-if="msg.sender === 'bot'" :key="msg.createdAt" class="flex flex-row mb-2 justify-start">
          <img :src="msg.user.avatar" class="w-8 h-8 rounded-sm mr-2 shadow-md">
          <div class="mr-10">
            <p class="text-sm">
              {{ msg.user.nickname }} <span class="text-gray-400 text-[10px]">{{
                timestampToTime(msg.createdAt)
              }}</span>
            </p>
            <div class="text-sm w-fit rounded-md rounded-tl-none px-2 py-1 bg-gh-card border border-github shadow-sm select-text">
              {{ msg.text }}
            </div>
          </div>
        </div>
        <div v-if="msg.sender === 'user'" :key="msg.createdAt" class="flex flex-row mb-2 justify-end ">
          <div class="ml-10">
            <p class="text-right">
              <span class="text-gray-400 text-[10px]">{{
                timestampToTime(msg.createdAt)
              }}</span>
            </p>
            <div class="text-sm float-right w-fit rounded-md rounded-tr-none px-2 py-1 bg-blue-500 text-white shadow-sm select-text">
              {{ msg.text }}
            </div>
          </div>
          <img :src="msg.user.avatar" class="w-8 h-8 rounded-sm ml-2 shadow-md">
        </div>
      </template>
    </div>
    <div class="flex">
      <input
        v-model="question"
        type="text"
        class="flex-1 outline-none px-2 bg-github border border-gh-btn focus:border-gh-btn-hover transition-all rounded-lg"
        placeholder="请输入你的问题"
        @keydown.enter="submitQuestion"
      >
      <button class="px-4 py-1 ml-2 rounded-md bg-blue-500 text-white" @click="submitQuestion">
        提交
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { useToast } from 'vue-toastification'
import { qaBaseURL } from '@/config'

defineEmits(['close'])

const toast = useToast()

const question = ref('')
const msgList = ref([
  {
    sender: 'bot',
    user: {
      avatar: 'https://icdn.amarea.cn/upload/2023/01/63b8320ddad73.webp',
      nickname: 'ChatBot',
    },
    text: '你好呀，我是分布式学习问答机器人，很高兴认识你',
    createdAt: Date.now(),
  },
])
const msgContainer = ref<HTMLDivElement>()

function timestampToTime(timestamp: number) {
  // let date = new Date(timestamp * 1000); // 10位时间戳
  const date = new Date(timestamp) // 13位时间戳
  const Y = `${date.getFullYear()}-`
  const M = `${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}-`
  const D = `${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()} `
  const h = `${date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}:`
  const m = `${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}:`
  const s = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
  return Y + M + D + h + m + s
}

function submitQuestion() {
  if (question.value.trim() === '') {
    toast.warning('问题不能为空')
    return
  }
  msgList.value.push({
    sender: 'user',
    user: {
      avatar: 'https://icdn.amarea.cn/upload/2023/01/63b8320ddad73.webp',
      nickname: '用户',
    },
    text: question.value,
    createdAt: Date.now(),
  })
  nextTick(() => {
    if (msgContainer.value)
      msgContainer.value.scrollTo({ top: msgContainer.value.scrollHeight, behavior: 'smooth' })
  })
  getAnswer(question.value)
  question.value = ''
}

async function getAnswer(question: string) {
  axios.post(`${qaBaseURL}/api/answer`, {
    question,
  }, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
    .then((res) => {
      msgList.value.push({
        sender: 'bot',
        user: {
          avatar: 'https://icdn.amarea.cn/upload/2023/01/63b8320ddad73.webp',
          nickname: 'ChatBot',
        },
        text: res.data.msg,
        createdAt: Date.now(),
      })
      nextTick(() => {
        if (msgContainer.value)
          msgContainer.value.scrollTo({ top: msgContainer.value.scrollHeight, behavior: 'smooth' })
      })
    })
}
</script>
