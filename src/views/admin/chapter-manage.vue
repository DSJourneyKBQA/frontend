<template>
  <div>
    <p class="mb-4 text-2xl font-bold">
      学习章节管理
    </p>
    <div v-show="!showInitChapter && !showEditChapter">
      <h3 class="my-2">
        章节管理
      </h3>
      <p>上下拖动可调整章节位置</p>
      <Draggable
        v-model="chapterList"
        :component-data="{
          tag: 'div',
          type: 'transition-group',
          name: !drag ? 'flpi-list' : null,
        }"
        v-bind="dragOptions"
        item-key="sid"
        @start="drag = true"
        @end="drag = false"
      >
        <template #item="{ element }">
          <div
            class="border px-2 py-1 flex gap-3 items-center transition-[padding,background] hover:bg-gray-200"
          >
            <div class="flex-1">
              <input
                v-model="element.name" type="text"
                class="w-full outline-none bg-transparent"
                :class="{
                  'pl-6': element.isChild,
                }"
              >
            </div>
            <div class="text-center w-[100px] border-x">
              章节ID：{{ element.id }}
            </div>
            子章节：<CommonSwitch v-model="element.isChild" />
            <div class="pl-3 border-l">
              <CommonButton v-if="element.id === -1" @click="handleStartInitChapter(element.sid)">
                初始化
              </CommonButton>
              <CommonButton v-if="element.id !== -1" @click="handleStartEditChapter(element.id)">
                编辑
              </CommonButton>
              <CommonButton @click="deleteChapter(element.sid)">
                删除
              </CommonButton>
            </div>
          </div>
        </template>
      </Draggable>
      <div class="my-2">
        <CommonButton primary @click="saveChapterData">
          保存
        </CommonButton>
        <CommonButton @click="fetchData">
          重置
        </CommonButton>
        <CommonButton @click="addChapter">
          增加
        </CommonButton>
      </div>
    </div>
    <div v-show="showInitChapter">
      <h3 class="my-2">
        章节初始化
      </h3>
      <div class="font-bold my-1">
        章节标题
      </div>
      <input v-model="newChapter.title" class="w-full p-2 rounded-md border hover:border-blue-500 transition-colors" type="text">
      <div class="font-bold my-1">
        章节描述
      </div>
      <input v-model="newChapter.description" class="w-full p-2 rounded-md border hover:border-blue-500 transition-colors" type="text">
      <div class="font-bold my-1">
        章节内容
      </div>
      <EditorMarkdown v-model="newChapter.content" class="h-[400px]" />
      <div class="my-2">
        <CommonButton primary @click="handleInitChapter">
          初始化
        </CommonButton>
        <CommonButton @click="showInitChapter = false">
          取消
        </CommonButton>
      </div>
    </div>
    <div v-show="showEditChapter">
      <h3 class="my-2">
        编辑章节
      </h3>
      <div class="font-bold my-1">
        章节标题
      </div>
      <input v-model="newChapter.title" class="w-full p-2 rounded-md border hover:border-blue-500 transition-colors" type="text">
      <div class="font-bold my-1">
        章节描述
      </div>
      <input v-model="newChapter.description" class="w-full p-2 rounded-md border hover:border-blue-500 transition-colors" type="text">
      <div class="font-bold my-1">
        章节内容
      </div>
      <EditorMarkdown v-model="newChapter.content" class="h-[400px]" />
      <div class="my-2">
        <CommonButton primary @click="handleEditChapter">
          保存
        </CommonButton>
        <CommonButton @click="showEditChapter = false">
          取消
        </CommonButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import NProgress from 'nprogress'
import { useToast } from 'vue-toastification'
import Draggable from 'vuedraggable'
import { useStore } from '@/store'
import { editChapter, getChapterData, initChapter, updateChapterData } from '@/api/admin'
import { getChapterContent } from '@/api/study'

interface ChapterData {
  id: number
  sid: number
  name: string
  isChild: boolean
}

const store = useStore()
const toast = useToast()

const chapterList = ref<ChapterData[]>([])
const drag = ref(false)
const dragOptions = ref({
  animation: 200,
  group: 'description',
  disabled: false,
  ghostClass: 'ghost',
})
const newChapter = ref({
  title: '',
  description: '',
  content: '',
})
const newChapterSid = ref(-1)
const editChapterCid = ref(-1)
const showInitChapter = ref(false)
const showEditChapter = ref(false)

let sid = 1

onMounted(() => {
  fetchData()
})

function fetchData() {
  NProgress.start()
  chapterList.value = []
  getChapterData(store.token)
    .then((res: any) => {
      sid = 1
      const data = JSON.parse(res)
      data.forEach((element: any) => {
        element.sid = sid++
        element.isChild = false
        chapterList.value.push(element)
        element.children.forEach((child: any) => {
          element.sid = sid++
          child.isChild = true
          chapterList.value.push(child)
        })
      })
    })
    .catch((err: any) => {
      toast.error(err.message)
    })
    .finally(() => {
      NProgress.done()
    })
}

function saveChapterData() {
  if (chapterList.value.length <= 0) {
    toast.warning('至少要有一个章节')
    return
  }
  if (chapterList.value[0].isChild) {
    toast.warning('第一个章节不能为子章节')
    return
  }
  const data: any[] = []
  chapterList.value.forEach((element) => {
    if (element.isChild) {
      data[data.length - 1].children.push({
        name: element.name,
        id: element.id,
      })
    }
    else {
      data.push({
        name: element.name,
        id: element.id,
        children: [],
      })
    }
  })
  NProgress.start()
  updateChapterData(store.token, JSON.stringify(data))
    .then((res: any) => {
      toast.success('保存成功')
    })
    .catch((err: any) => {
      toast.error(err.message)
    })
    .finally(() => {
      NProgress.done()
    })
}

function deleteChapter(sid: number) {
  const index = chapterList.value.findIndex(item => item.sid === sid)
  if (index === -1) {
    toast.warning('章节不存在')
    return
  }
  chapterList.value.splice(index, 1)
}

function addChapter() {
  chapterList.value.push({
    id: -1,
    sid: sid++,
    name: '',
    isChild: false,
  })
}

function handleInitChapter() {
  if (newChapter.value.title.trim() === '') {
    toast.warning('章节标题不能为空')
    return
  }
  if (newChapter.value.description.trim() === '') {
    toast.warning('章节描述不能为空')
    return
  }
  if (newChapter.value.content.trim() === '') {
    toast.warning('章节内容不能为空')
    return
  }
  NProgress.start()
  initChapter(store.token, newChapter.value.title, newChapter.value.description, newChapter.value.content)
    .then((res: any) => {
      chapterList.value.find(item => item.sid === newChapterSid.value)!.id = res
      showInitChapter.value = false
    })
    .catch((err: any) => {
      toast.error(err.message)
    })
    .finally(() => {
      NProgress.done()
    })
}

function handleEditChapter() {
  if (newChapter.value.title.trim() === '') {
    toast.warning('章节标题不能为空')
    return
  }
  if (newChapter.value.description.trim() === '') {
    toast.warning('章节描述不能为空')
    return
  }
  if (newChapter.value.content.trim() === '') {
    toast.warning('章节内容不能为空')
    return
  }
  NProgress.start()
  editChapter(store.token, editChapterCid.value, newChapter.value.title, newChapter.value.description, newChapter.value.content)
    .then((res: any) => {
      toast.success('保存成功')
      showEditChapter.value = false
    })
    .catch((err: any) => {
      toast.error(err.message)
    })
    .finally(() => {
      NProgress.done()
    })
}

function handleStartInitChapter(sid: number) {
  showInitChapter.value = true
  newChapterSid.value = sid
  newChapter.value.title = ''
  newChapter.value.description = ''
  newChapter.value.content = ''
}

function handleStartEditChapter(cid: number) {
  getChapterContent(cid)
    .then((res: any) => {
      showEditChapter.value = true
      editChapterCid.value = cid
      newChapter.value.title = res.title
      newChapter.value.description = res.description
      newChapter.value.content = res.content
    })
    .catch((err: any) => {
      toast.error(err.message)
    })
}
</script>

<style>
.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0s;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>
