<template>
  <div class="flex h-[calc(100vh-60px)] overflow-hidden">
    <Sidebar :data="chapters" @change-chapter="handleChangeChapter" />
    <div class="flex-1 p-4 h-full overflow-y-auto">
      <div v-if="chapterContent" class="px-8">
        <h2 class="text-3xl">
          {{ chapterContent.title }}
        </h2>
        <div class="text-xl font-light">
          {{ chapterContent.description }}
        </div>
        <div class="rendered" v-html="renderMarkdown(chapterContent.content)" />
        <div class="my-1">
          <CommonButton primary @click="handleCompleteChapter">
            完成本章学习
          </CommonButton>
        </div>
      </div>
      <div v-else class="text-center">
        请选择章节
      </div>
    </div>
    <div
      class="h-full flex flex-col border-l transition-all" :class="{
        'flex-1': showCodeEditor,
        'w-0': !showCodeEditor,
      }"
    >
      <div class="h-[60%] overflow-y-auto">
        <div class="border-b flex justify-between">
          <div class="p-2 border-r">
            代码编辑器
          </div>
          <div class="p-2 border-l hover:bg-gray-200 cursor-pointer" @click="showCodeEditor = false">
            <IconClose class="w-5 h-5 inline-block" />
          </div>
        </div>
        <Codemirror
          v-model="code"
          placeholder="请输入代码"
          class="w-full h-full"
          :autofocus="true"
          :tab-size="2"
          :indent-with-tab="true"
          :extensions="extensions"
        />
      </div>
      <div class="h-[40%] border-t">
        <div class="border-b flex">
          <div class="p-2 border-r">
            运行结果
          </div>
          <div class="p-2 border-r">
            当前题目：{{ selectQuestionId }}
          </div>
          <div class="p-2 border-r hover:bg-gray-200 cursor-pointer" @click="runTest">
            运行<IconPlay class="w-5 h-5 inline-block" />
          </div>
          <div class="p-2 border-r hover:bg-gray-200 cursor-pointer" @click="codeRunResult = ''">
            清空<IconClose class="w-5 h-5 inline-block" />
          </div>
        </div>
        <textarea v-model="codeRunResult" class="w-full h-full resize-none outline-none p-2" readonly />
      </div>
    </div>
    <div class="absolute right-4 bottom-4 flex flex-col items-end">
      <div
        v-if="!showCodeEditor"
        class="p-4 border shadow-lg bg-white rounded-[66px] w-[66px] h-[66px] hover:bg-gray-200 cursor-pointer transition-all duration-300 overflow-hidden mb-2"
        @click="showCodeEditor = true"
      >
        <IconEdit class="w-8 h-8 text-blue-500" />
      </div>
      <div
        class="p-4 border shadow-lg bg-white transition-all duration-300 overflow-hidden"
        :class="{
          'rounded-[66px] w-[66px] h-[66px] hover:bg-gray-200 cursor-pointer': !showQABot,
          'rounded-lg w-[400px] h-[600px]': showQABot,
        }"
        @click="showQABot = true"
      >
        <KBQA v-if="showQABot" @close="showQABot = false" />
        <IconChat v-if="!showQABot" class="w-8 h-8 text-blue-500" />
      </div>
    </div>
  </div>
  <!-- <div class="p-8">
    <div class="text-3xl font-bold py-4">
      选择学习章节
    </div>
    <div class="text-2xl font-bold my-3">
      初识分布式
    </div>
    <div class="flex flex-wrap">
      <div
        v-for="chapter, index in chapters" :key="index"
        class="relative border w-[200px] h-[300px] flex justify-center items-center m-4 bg-white rounded-xl shadow-xl hover:text-white hover:shadow-2xl hover:-translate-y-2 text-xl hover:text-3xl transition-all duration-300 cursor-pointer overflow-hidden"
        :class="colors[index % colors.length]"
      >
        <div class="z-10">
          {{ chapter.name }}
        </div>
        <div class="absolute w-full h-full bg-transparent hover:bg-black/40 transition-colors duration-300 z-0" />
      </div>
    </div>
    <div class="text-2xl font-bold my-3">
      初识分布式
    </div>
    <div class="flex flex-wrap">
      <div
        v-for="chapter, index in chapters" :key="index"
        class="border w-[200px] h-[300px] flex justify-center items-center m-4 bg-white rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-2 text-xl hover:text-3xl transition-all duration-300 cursor-pointer"
      >
        {{ chapter.name }}
      </div>
    </div>
  </div> -->
</template>

<script setup  lang="ts">
import NProgress from 'nprogress'
import { Codemirror } from 'vue-codemirror'
import { StreamLanguage } from '@codemirror/language'
import { go } from '@codemirror/legacy-modes/mode/go'
import { useToast } from 'vue-toastification'
import { completeChapter, getChapterContent, getChapterList, submitTest } from '@/api/study'
import { useStore } from '@/store'
import type { ChapterContentData, ChapterData } from '@/types'
import { renderMarkdown } from '@/utils'

const store = useStore()
const toast = useToast()

const colors = ['bg-red-500', 'bg-yellow-500', 'bg-green-500', 'bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500']
const extensions = [StreamLanguage.define(go)]

const chapters = ref<ChapterData[]>([])
const chapterContent = ref<ChapterContentData>()
const selectQuestionId = ref(2)
const code = ref('')
const codeRunResult = ref('')
const showQABot = ref(false)
const showCodeEditor = ref(false)

onMounted(async () => {
  fetchData()
})

function fetchData() {
  NProgress.start()
  getChapterList(store.token, store.uid)
    .then((res: any) => {
      chapters.value = handleChapterData(res)
    }).finally(() => {
      NProgress.done()
    })
}

function handleChapterData(data: any): ChapterData[] {
  const chapters = data.chapterData
  const userStatus = data.userData
  chapters.forEach((chapter: any) => {
    chapter.status = true
    chapter.children.forEach((ele: any) => {
      const status = userStatus.find((v: any) =>
        v.cid === ele.id,
      )
      if (status) {
        ele.status = true
        ele.score = status.score
      }
      else {
        chapter.status = false
        ele.status = false
        ele.score = 0
      }
    })
  })
  return chapters
}

async function handleChangeChapter(chapterId: number) {
  if (chapterId === -1)
    return
  chapterContent.value = await getChapterContent(chapterId)
}

function runTest() {
  if (code.value.trim() === '') {
    toast.warning('不可提交空代码')
    return
  }
  submitTest(store.token, selectQuestionId.value, code.value)
    .then((res: any) => {
      codeRunResult.value = JSON.stringify(res)
    })
    .catch((err: Error) => {
      toast.error(err.message)
    })
}

function handleCompleteChapter() {
  if (!chapterContent.value) {
    toast.warning('请先选择章节')
    return
  }
  completeChapter(store.token, chapterContent.value.cid)
    .then(() => {
      toast.success('恭喜你完成本章学习')
    })
    .catch((err) => {
      toast.error(err.message)
    })
}
</script>

<style>
code.hljs {
  @apply rounded-xl leading-normal my-3;
}

.rendered img {
  @apply max-w-full rounded-xl;
}

.rendered>* {
  @apply my-2;
}
</style>
