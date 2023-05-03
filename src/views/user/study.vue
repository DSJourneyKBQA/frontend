<template>
  <div class="flex h-[calc(100vh-60px)] overflow-hidden">
    <Sidebar :data="chapters" @change-chapter="handleChangeChapter" />
    <div class="flex-1 h-full overflow-y-auto relative">
      <div v-if="chapterContent" class="px-16">
        <h2 class="text-3xl">
          {{ chapterContent.title }}
        </h2>
        <div class="text-xl font-light">
          {{ chapterContent.description }}
        </div>
        <div class="rendered" v-html="renderMarkdown(chapterContent.content)" />
        <div v-if="!chapterContent.status" class="my-1">
          <CommonButton primary dark @click="handleCompleteChapter">
            完成本章学习
          </CommonButton>
        </div>
      </div>
      <div v-show="!chapterContent" class="w-full h-full relative overflow-hidden">
        <!-- <div class="noite" /> -->
        <div class="constelacao" />
        <div class="chuvaMeteoro" />
      </div>
      <div v-show="!chapterContent" id="visnetwork" class="w-full h-full absolute top-0 left-0" />
    </div>
    <div
      class="h-full flex flex-col border-l transition-all relative border-github" :class="{
        'flex-1': showCodeEditor,
        'w-0': !showCodeEditor,
      }"
    >
      <div
        v-if="waitTestResult"
        class="absolute w-full h-full top-0 left-0 flex flex-col items-center justify-center bg-white/10 z-50 select-none"
      >
        <IconLoading class="w-20 h-20" :dark="false" />
        <div class="mt-4">
          等待运行结果
        </div>
      </div>
      <div class="h-[60%] flex flex-col">
        <div class="border-b border-github w-full flex justify-between">
          <div class="p-2 border-r border-github">
            代码编辑器
          </div>
          <div
            class="p-2 border-l border-github hover:bg-gh-btn-hover cursor-pointer transition-colors"
            @click="showCodeEditor = false"
          >
            <IconClose class="w-5 h-5 inline-block" />
          </div>
        </div>
        <div class="flex-1 overflow-y-auto">
          <Codemirror
            v-model="code" placeholder="请输入代码" class="w-full" :autofocus="true" :tab-size="2"
            :indent-with-tab="true" :extensions="extensions"
          />
        </div>
      </div>
      <div class="h-[40%] border-t border-github flex flex-col">
        <div class="border-b border-github flex">
          <div class="p-2 border-r border-github">
            运行结果
          </div>
          <div class="p-2 border-r border-github">
            题目：<select
              v-model.number="selectTestIndex"
              class="px-1 outline-none bg-gh-btn hover:bg-gh-btn-hover border border-gh-btn hover:border-gh-btn-hover rounded-lg transition-colors"
            >
              <option value="-1">
                未选中
              </option>
              <option v-for="test, idx in testList" :key="test.id" :value="idx">
                {{ test.id }}
              </option>
            </select>
          </div>
          <div class="p-2 border-r border-github hover:bg-gh-btn-hover cursor-pointer transition-colors" @click="runTest">
            运行
            <IconPlay class="w-5 h-5 inline-block" />
          </div>
          <div
            class="p-2 border-r border-github hover:bg-gh-btn-hover cursor-pointer transition-colors"
            @click="testResult = []"
          >
            清空结果
            <IconClose class="w-5 h-5 inline-block" />
          </div>
        </div>
        <div ref="resultContainer" class="w-full flex-1 p-2 bg-github overflow-y-auto">
          <div
            v-for="result, index in testResult" :key="index"
            class="p-2 border-t border-github"
          >
            <div v-if="result.code === 0" class="text-green-400">
              {{ formatTime(result.timestamp) }} 运行成功
            </div>
            <div v-if="result.code === 1" class="text-red-400">
              {{ formatTime(result.timestamp) }} 编译失败
            </div>
            <div v-if="result.code === 2" class="text-yellow-400">
              {{ formatTime(result.timestamp) }} 运行超时
            </div>
            <div v-if="result.code === -1" class="text-red-400">
              {{ formatTime(result.timestamp) }} 未知错误
            </div>
            {{ result.msg }}
          </div>
        </div>
      </div>
    </div>
    <div class="absolute right-6 bottom-6 flex flex-col items-end">
      <div
        v-if="!showCodeEditor"
        class="p-4 bg-gh-btn hover:bg-gh-btn-hover border border-gh-btn shadow-lg rounded-[66px] w-[66px] h-[66px] cursor-pointer transition-all duration-300 overflow-hidden mb-2"
        @click="showCodeEditor = true"
      >
        <IconEdit class="w-8 h-8 text-blue-500" />
      </div>
      <div
        class="p-4 border border-gh-btn shadow-lg transition-all duration-300 overflow-hidden" :class="{
          'rounded-[66px] w-[66px] h-[66px] bg-gh-btn hover:bg-gh-btn-hover hover:border-gh-btn-hover cursor-pointer': !showQABot,
          'rounded-lg w-[400px] h-[600px] bg-gh-card': showQABot,
        }" @click="showQABot = true"
      >
        <KBQA v-if="showQABot" @close="showQABot = false" />
        <IconChat v-if="!showQABot" class="w-8 h-8 text-blue-500" />
      </div>
    </div>
  </div>
</template>

<script setup  lang="ts">
import NProgress from 'nprogress'
import { Codemirror } from 'vue-codemirror'
import { StreamLanguage } from '@codemirror/language'
import { oneDark } from '@codemirror/theme-one-dark'
import { go } from '@codemirror/legacy-modes/mode/go'
import { useToast } from 'vue-toastification'
import type { Options as VisOption } from 'vis-network/standalone'
import { DataSet, Network } from 'vis-network/standalone'
import axios from 'axios'
import { completeChapter, getChapterContent, getChapterList, submitTest } from '@/api/study'
import { useStore } from '@/store'
import type { ChapterContentData, ChapterData, TestData, TestResultData } from '@/types'
import { formatTime, parseTest, renderMarkdown } from '@/utils'
import { qaBaseURL } from '@/config'

const store = useStore()
const toast = useToast()

const extensions = [StreamLanguage.define(go), oneDark]

const chapters = ref<ChapterData[]>([])
const chapterContent = ref<ChapterContentData>()
const testList = ref<TestData[]>([])
const selectTestIndex = ref(-1)
const code = ref('')
const testResult = ref<TestResultData[]>([])
const showQABot = ref(false)
const showCodeEditor = ref(false)
const waitTestResult = ref(false)
const resultContainer = ref<HTMLDivElement>()

let network: Network

const nodes = new DataSet([])

const edges = new DataSet([])

const data = {
  nodes,
  edges,
}

const options: VisOption = {
  nodes: {
    shape: 'image',
    // color: {
    //   background: '#3b82f6',
    //   border: '#444c56',
    // },
    font: {
      color: '#fff',
    },
  },
  edges: {
    length: 200,
    color: {
      color: '#ffffff5e',
      highlight: '#ffffff5e',
    },
    arrows: {
      to: {
        enabled: true,
      },
    },
  },
  interaction: {
    hover: true,
  },
}
const _nodeNames: string[] = []

onMounted(async () => {
  fetchData()
  const container = document.getElementById('visnetwork')
  if (container)
    network = new Network(container, data, options)
  network?.on('click', (properties) => {
    toast.info(JSON.stringify(properties.nodes))
  })
  drawBackground()
})

function drawBackground() {
  // estrelas

  const style = ['style1', 'style2', 'style3', 'style4']
  const tam = ['tam1', 'tam1', 'tam1', 'tam2', 'tam3']
  const opacity = ['opacity1', 'opacity1', 'opacity1', 'opacity2', 'opacity2', 'opacity3']

  function getRandomArbitrary(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min
  }

  let estrela = ''
  const qtdeEstrelas = 250
  const noite = document.querySelector('.constelacao')
  const widthWindow = window.innerWidth
  const heightWindow = window.innerHeight

  for (let i = 0; i < qtdeEstrelas; i++) {
    estrela += `<span class='estrela ${style[getRandomArbitrary(0, 4)]} ${opacity[getRandomArbitrary(0, 6)]} ${
         tam[getRandomArbitrary(0, 5)]}' style='animation-delay: .${getRandomArbitrary(0, 9)}s; left: ${
         getRandomArbitrary(0, widthWindow)}px; top: ${getRandomArbitrary(0, heightWindow)}px;'></span>`
  }

  noite && (noite.innerHTML = estrela)

  // meteoros

  let numeroAleatorio = 5000

  setTimeout(() => {
    carregarMeteoro()
  }, numeroAleatorio)

  function carregarMeteoro() {
    setTimeout(carregarMeteoro, numeroAleatorio)
    numeroAleatorio = getRandomArbitrary(5000, 10000)
    const meteoro = `<div class='meteoro ${style[getRandomArbitrary(0, 4)]}'></div>`
    const chuvaMeteoros = document.getElementsByClassName('.chuvaMeteoro')
    if (chuvaMeteoros.length > 0) {
      chuvaMeteoros[0].innerHTML = meteoro
      setTimeout(() => {
        chuvaMeteoros[0].innerHTML = ''
      }, 1000)
    }
  }
}

watchEffect(() => {
  if (selectTestIndex.value !== -1)
    code.value = testList.value[selectTestIndex.value].template || ''
})

function fetchData() {
  NProgress.start()
  getChapterList(store.token, store.uid)
    .then((res: any) => {
      chapters.value = handleChapterData(res)
    }).finally(() => {
      NProgress.done()
    })
  getRoadmapData()
    .then((res) => {
      network.redraw()
      const _nodes: any[] = res.data.data.nodes
      const _rels: any[] = res.data.data.rels
      const addNodes: any[] = []

      _nodes.forEach((node, index) => {
        addNodes.push({
          id: index,
          label: node.name,
          image: `/star.${node.type}.png`,
        })
        _nodeNames.push(node.name)
      })
      nodes.add(addNodes as never[])

      for (const rel of _rels) {
        if (rel.type === 'require') {
          edges.add([{
            from: _nodeNames.indexOf(rel.end),
            to: _nodeNames.indexOf(rel.start),
            value: 4,
          }] as never[])
        }
        else {
          edges.add([{
            from: _nodeNames.indexOf(rel.start),
            to: _nodeNames.indexOf(rel.end),
            value: 2,
          }] as never[])
        }
      }
    })
}

async function getRoadmapData() {
  return axios.get(`${qaBaseURL}/api/roadmap`)
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

async function handleChangeChapter(chapterId: number, status: boolean) {
  if (chapterId === -1)
    return
  chapterContent.value = await getChapterContent(chapterId)
  if (chapterContent.value) {
    selectTestIndex.value = -1
    chapterContent.value.status = status
    testList.value = parseTest(chapterContent.value.content)
  }
}

function runTest() {
  if (code.value.trim() === '') {
    toast.warning('不可提交空代码')
    return
  }
  if (selectTestIndex.value === -1) {
    toast.warning('请先选择题目')
    return
  }
  waitTestResult.value = true
  submitTest(store.token, testList.value[selectTestIndex.value].id, code.value)
    .then((res: any) => {
      testResult.value.push({ ...res, timestamp: Date.now() })
      nextTick(() => {
        if (resultContainer.value)
          resultContainer.value.scrollTo({ top: resultContainer.value.scrollHeight, behavior: 'smooth' })
      })
    })
    .catch((err: Error) => {
      toast.error(err.message)
    })
    .finally(() => {
      waitTestResult.value = false
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
      fetchData()
      if (chapterContent.value)
        chapterContent.value.status = true
    })
    .catch((err) => {
      toast.error(err.message)
    })
}
</script>

<style>
.noite {
  background: -webkit-linear-gradient(top, rgb(0, 0, 0) 50%, rgb(25, 19, 39)80%, rgb(43, 32, 72));
  width: 100%;
  height: 100%;
  position: absolute;
  overflow: hidden;
}

.constelacao {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  animation: rotate 600s infinite linear;
}

.estrela {
  background-color: white;
  border-radius: 50%;
  position: absolute;
  animation-name: estrela;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

.estrela.style1 { animation-duration: 0.5s; animation-name: estrela; }
.estrela.style2 { animation-duration: 1s; animation-name: estrela; }
.estrela.style3 { animation-duration: 1.5s; animation-name: estrela; }
.estrela.style4 { animation-duration: 2s; animation-name: estrelaDestacada; }

.estrela.tam1 { width: 1px; height: 1px; }
.estrela.tam2 { width: 2px; height: 2px; }
.estrela.tam3 { width: 3px; height: 3px; }

.estrela.opacity1 { opacity:  1; }
.estrela.opacity2 { opacity: .5; }
.estrela.opacity3 { opacity: .1; }

.meteoro {
  position: absolute;
  background-color: #fff;
  width: 2px;
  height: 2px;
  border-radius: 50%;
  transform: rotate(-35deg);
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-duration: 1s;
}

.meteoro:before {
  content: "";
  display: inline-block;
  vertical-align: middle;
  margin-right: 10px;
  width: 0;
  height: 0;
  border-top: 1px solid transparent;
  border-bottom: 1px solid transparent;
  border-left: 85px solid white;
  position: absolute;
  left: 2px;
  top: 0;
}

.meteoro.style1 { animation-name: meteoroStyle1; }
.meteoro.style2 { animation-name: meteoroStyle2; }
.meteoro.style3 { animation-name: meteoroStyle3; }
.meteoro.style4 { animation-name: meteoroStyle4; }

@keyframes escurecer {
  0%   { top: 0; }
  100% { top: 100%; }
}

@keyframes estrela {
  0% {
    box-shadow: 0 0 10px 0px rgba(255, 255, 255, 0.05);
  }
  50% {
    box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.4);
  }
  100% {
    box-shadow: 0 0 10px 0px rgba(255, 255, 255, 0.05);
  }
}

@keyframes estrelaDestacada {
  0% {
    background-color: #FFFFFF;
    box-shadow: 0 0 10px 0px rgba(255, 255, 255, 1);
  }
  20% {
    background-color: #FFC4C4;
    box-shadow: 0 0 10px 0px rgb(255, 196, 196, 1);
  }
  80% {
    background-color: #C4CFFF;
    box-shadow: 0 0 10px 0px rgb(196, 207, 255, 1);
  }
  100% {
    background-color: #FFFFFF;
    box-shadow: 0 0 10px 0px rgba(255, 255, 255, 0.2);
  }
}

@keyframes meteoroStyle1 {
  0% { opacity: 0; right: 300px; top: 100px; }
  30% { opacity: .3; }
  60% { opacity: .3; }
  100% { opacity: 0; right: 1000px; top: 600px; }
}

@keyframes meteoroStyle2 {
  0% { opacity: 0; right: 700px; top: 100px; }
  30% { opacity: 1; }
  60% { opacity: 1; }
  100% { opacity: 0; right: 1400px; top: 600px; }
}

@keyframes meteoroStyle3 {
  0% { opacity: 0; right: 300px; top: 300px; }
  30% { opacity: 1; }
  60% { opacity: 1; }
  100% { opacity: 0; right: 1000px; top: 800px; }
}

@keyframes meteoroStyle4 {
  0% { opacity: 0; right: 700px; top: 300px; }
  30% { opacity: 1; }
  60% { opacity: 1; }
  100% { opacity: 0; right: 1400px; top: 800px; }
}

@keyframes rotate {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}
</style>
