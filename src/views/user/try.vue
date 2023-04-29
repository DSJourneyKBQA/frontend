<template>
  <div class="h-[calc(100vh-60px)] bg-[#1c2128] w-full flex">
    <div class="flex-1 flex h-full items-center justify-center relative">
      <div class="bg-[#22272e] w-[60px] h-full shrink-0 border-r border-[#373e47]">
        <TryToolBarItem
          v-for="itemType in itemTypeList" :key="itemType.value"
          :title="itemType.label"
          @dblclick="addItem(itemType.value)"
          @mousedown="draggingToolbarItem = true"
          @mouseup="draggingToolbarItem = false"
          @mouseleave="dragAddItem(itemType.value, $event)"
        >
          <IconDynamic :type="itemType.value" class="w-8 h-8 text-white" />
        </TryToolBarItem>
      </div>
      <div
        ref="canvasEl"
        class="canvas bg-[#1c2128] flex-1 h-full overflow-hidden relative"
        @dblclick="boxSelectionCancel"
        @mousedown="boxSelectionStart"
        @mouseup="dragEnd"
        @mouseleave="dragEnd"
        @mousemove="dragMove"
      >
        <TryTutorial
          v-show="showTutorial"
          class="absolute top-2 right-14 z-50"
          @close="showTutorial = false"
        />
        <div class="absolute right-2 top-2" @mousedown.stop="null">
          <div
            class="mb-2 p-1.5 bg-[#373e47] border border-[#444c56] text-[#a3bac7] rounded-lg hover:border-[#768390] hover:bg-[#444c56] cursor-pointer"
            @click="items = []"
          >
            <IconRefresh class="w-6 h-6" />
          </div>
          <div
            v-if="items.filter((item) => item.select).length !== 0"
            class="mb-2 p-1.5 bg-[#373e47] border border-[#444c56] text-[#a3bac7] rounded-lg hover:border-[#768390] hover:bg-[#444c56] cursor-pointer"
            @click="deleteSelectedItems"
          >
            <IconTrash class="w-6 h-6" />
          </div>
          <div
            v-if="!showTutorial"
            class="mb-2 p-1.5 bg-[#373e47] border border-[#444c56] text-[#a3bac7] rounded-lg hover:border-[#768390] hover:bg-[#444c56] cursor-pointer"
            @click="showTutorial = true"
          >
            <IconAcademic class="w-6 h-6" />
          </div>
        </div>
        <TryCanvasItem
          v-for="item, index in items" :key="index"
          :index="index"
          :type="item.type"
          :status="item.status"
          :position="item.position"
          :select="item.select"
          :class="{
            'select-none': dragging,
          }"
          title="服务器"
          @drag-start="dragStart"
          @select="showInfoPanel = true;selectIndex = index"
        />
        <div
          v-show="boxSelectionConfig.enable"
          class="absolute bg-transparent border border-white/50 select-none"
          :style="{
            left: `${(boxSelectionConfig.width > 0 ? boxSelectionConfig.x : boxSelectionConfig.x + boxSelectionConfig.width) - 60}px`,
            top: `${(boxSelectionConfig.height > 0 ? boxSelectionConfig.y : boxSelectionConfig.y + boxSelectionConfig.height) - 60}px`,
            width: `${Math.abs(boxSelectionConfig.width)}px`,
            height: `${Math.abs(boxSelectionConfig.height)}px`,
          }"
        />
      </div>
    </div>
    <div
      class="bg-[#22272e] transition-[width] duration-300 relative overflow-hidden border-l border-[#373e47] text-white"
      :class="{
        'w-[500px]': showInfoPanel,
        'w-0': !showInfoPanel,
      }"
    >
      <div v-if="selectIndex !== -1" class="w-[500px] h-full p-4 overflow-x-hidden overflow-y-auto flex flex-col">
        <button
          class="absolute right-0 top-0 p-2"
          @click="showInfoPanel = false"
        >
          <IconClose class="w-6 h-6" />
        </button>
        <!-- <div>类型：{{ items[selectIndex].type }}</div> -->
        <div>
          <template v-if=" items[selectIndex].type !== ItemType.GatewayServer">
            <button
              class="border px-2 py-0.5 mr-2 bg-[#373e47] hover:bg-[#444c56] border-[#464e57] hover:border-[#768390] rounded-md"
              @click=" startServer(items[selectIndex].id) "
            >
              启动
            </button>
            <button
              class="border px-2 py-0.5 mr-2 bg-[#373e47] hover:bg-[#444c56] border-[#464e57] hover:border-[#768390] rounded-md"
              @click=" stopServer(items[selectIndex].id) "
            >
              关闭
            </button>
          </template>

          <button
            class="border px-2 py-0.5 mr-2 bg-[#373e47] hover:bg-[#444c56] border-[#464e57] hover:border-[#768390] rounded-md"
            @click="deleteItem(selectIndex) "
          >
            删除
          </button>
          <button
            class="border px-2 py-0.5 mr-2 bg-[#373e47] hover:bg-[#444c56] border-[#464e57] hover:border-[#768390] rounded-md"
            @click="clearLog"
          >
            清空日志
          </button>
        </div>

        <div v-if=" items[selectIndex].type === ItemType.GatewayServer">
          <div class="rounded-md border border-[#768390] p-2 my-1">
            <div>
              网关地址：<input v-model=" items[selectIndex].address " type="text" class="bg-transparent px-2 rounded-md border border-[#768390]">
            </div>
            <div class="mt-2">
              <button
                class="border px-2 py-0.5 mr-2 bg-[#373e47] hover:bg-[#444c56] border-[#464e57] hover:border-[#768390] rounded-md"
                @click=" connectGateway "
              >
                连接网关
              </button>
              <button
                class="border px-2 py-0.5 mr-2 bg-[#373e47] hover:bg-[#444c56] border-[#464e57] hover:border-[#768390] rounded-md"
                @click=" disconnectGateway "
              >
                断开网关
              </button>
            </div>
          </div>
        </div>

        <div v-if="items[selectIndex].type === ItemType.ConfigServer">
          <div class="rounded-md border border-[#768390] p-2 my-1">
            <div class="mb-2">
              地址：<input v-model=" items[selectIndex].address" type="text" class="bg-transparent px-2 rounded-md border border-[#768390]">
            </div>
            <div>
              ID：<input v-model=" items[selectIndex].sid " type="text" class="bg-transparent px-2 rounded-md border border-[#768390]">
            </div>
          </div>

          <div class="my-1 rounded-md border border-[#768390] p-2">
            <div
              v-for="gid in groupList" :key="gid"
              class="w-fit inline-block"
            >
              <div class="rounded-md border border-[#768390]">
                <div class="border-b border-[#768390] px-2 py-1">
                  Group: {{ gid }}
                </div>
                <div class="px-2 py-1">
                  <div v-for=" server, index in storageServers.filter(ele => ele.gid === gid) " :key=" index ">
                    {{ server.address }}
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-2">
              <button
                class="border px-2 py-0.5 mr-2 bg-[#373e47] hover:bg-[#444c56] border-[#464e57] hover:border-[#768390] rounded-md"
                @click="setGroupInfo "
              >
                设置分组信息
              </button>
            </div>
          </div>
          <div class="rounded-md border border-[#768390] p-2">
            <div>
              路由表：
            </div>
            <div>
              <input
                v-for=" i, index in bucketConfig " :key=" i "
                v-model=" bucketConfig[index] "
                class="w-8 h-4 bg-white inline-block mx-0.5 text-black leading-4 text-center"
              >
            </div>
            <div class="mt-2">
              <button
                class="border px-2 py-0.5 mr-2 bg-[#373e47] hover:bg-[#444c56] border-[#464e57] hover:border-[#768390] rounded-md"
                @click=" setBucketInfo "
              >
                设置路由表
              </button>
            </div>
          </div>
        </div>

        <div v-if="items[selectIndex].type === ItemType.StorageServer">
          <div class="rounded-md border border-[#768390] p-2 my-1">
            <div class="mb-2">
              地址：<input v-model=" items[selectIndex].address " type="text" class="bg-transparent px-2 rounded-md border border-[#768390]">
            </div>
            <div>
              Group：<select
                v-model.number=" items[selectIndex].gid "
                class="bg-transparent"
              >
                <option v-for=" i in 10 " :key=" i " :value=" i ">
                  {{ i }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div v-if=" items[selectIndex].type === ItemType.Client ">
          <div class="rounded-md border border-[#768390] p-2 my-1">
            <div class="mb-2">
              key: <input v-model="clientConfig.key" type="text" class="bg-transparent px-2 rounded-md border border-[#768390]">
            </div>
            <div>
              value: <input v-model="clientConfig.value" type="text" class="bg-transparent px-2 rounded-md border border-[#768390]">
            </div>
            <div class="mt-2">
              <button
                class="border px-2 py-0.5 mr-2 bg-[#373e47] hover:bg-[#444c56] border-[#464e57] hover:border-[#768390] rounded-md"
                @click=" setStorageKv "
              >
                Put
              </button>
              <button
                class="border px-2 py-0.5 mr-2 bg-[#373e47] hover:bg-[#444c56] border-[#464e57] hover:border-[#768390] rounded-md"
                @click=" getStorageKv "
              >
                Get
              </button>
            </div>
          </div>
        </div>
        <div class="my-1">
          Service层日志
        </div>
        <div class="flex flex-1 overflow-y-auto flex-col p-1 border border-[#768390] rounded-md min-h-[200px]">
          <div
            v-for="log, index in serviceLogs" :key="index"
            ref="serviceLogEl"
            class="border-b border-[#768390] py-1 text-sm break-words"
          >
            {{ log }}
          </div>
        </div>
        <div class="my-1">
          Raft层日志
        </div>
        <div class="flex flex-1 overflow-y-auto flex-col p-1 border border-[#768390] rounded-md min-h-[200px]">
          <div
            v-for="log, index in raftLogs" :key="index"
            ref="raftLogEl"
            class="border-b border-[#768390] py-1 text-sm break-words"
          >
            {{ log }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from 'vue-toastification'
import { nanoid } from 'nanoid'
import { itemTypeList } from '@/config'
import { ItemType } from '@/enums'
import { useStore } from '@/store'
import type { CanvasItem } from '@/types'
import { gatewayDisconnect, gatewayStartServer, gatewayStopServer, getKv, putKv, setGroup, updateBucket } from '@/api/try'

const store = useStore()
const toast = useToast()

const items = ref<CanvasItem[]>([])
const dragging = ref(false)
const dragIndex = ref(-1)
const draggingToolbarItem = ref(false)
const serviceLogs = ref<string[]>([])
const raftLogs = ref<string[]>([])
const serviceLogEl = ref<HTMLDivElement>()
const raftLogEl = ref<HTMLDivElement>()
const canvasEl = ref<HTMLDivElement>()
const boxSelectionConfig = ref({
  enable: false,
  x: 0,
  y: 0,
  width: 0,
  height: 0,
})

const selectIndex = ref(-1)

const prePosition = ref<{ x: number; y: number }[]>([])
const mousePosition = ref({ x: 0, y: 0 })
const showInfoPanel = ref(false)
const showTutorial = ref(true)
const configLoaded = ref(false)
const bucketConfig = ref<number[]>([])
const configServers = computed(() => items.value.filter(item => item.type === ItemType.ConfigServer))
const storageServers = computed(() => items.value.filter(item => item.type === ItemType.StorageServer))
const groupList = computed(() => {
  const list: number[] = []
  items.value.forEach((item) => {
    if (item.type === ItemType.StorageServer) {
      if (!list.includes(item.gid))
        list.push(item.gid)
    }
  })
  return list
})
const clientConfig = ref({
  key: '',
  value: '',
})

let socket: WebSocket

onMounted(() => {
  items.value = JSON.parse(localStorage.getItem('items') || '[]')
  items.value.forEach((item) => {
    item.status = 0
    item.sid = Number(item.sid)
    item.gid = Number(item.gid)
    if (item.position.x < 0)
      item.position.x = 0

    if (item.position.y < 0)
      item.position.y = 0
  })
  bucketConfig.value = JSON.parse(localStorage.getItem('bucketConfig') || '[]')
  if (bucketConfig.value.length !== 15)
    bucketConfig.value = Array.from({ length: 15 }, () => 1)

  configLoaded.value = true
  store.navTheme = 'dark'
})

onUnmounted(() => {
  store.navTheme = 'light'
})

watchEffect(() => {
  if (!configLoaded.value)
    return
  localStorage.setItem('items', JSON.stringify(items.value))
  localStorage.setItem('bucketConfig', JSON.stringify(bucketConfig.value))
})

// 画布相关函数

function addItem(type: ItemType, initPosition: { x: number; y: number } = { x: 5, y: 5 }): boolean {
  if (type === ItemType.GatewayServer) {
    if (items.value.find(item => item.type === ItemType.GatewayServer)) {
      toast.error('只能添加一个网关服务器')
      return false
    }
  }
  if (type === ItemType.Client) {
    if (items.value.find(item => item.type === ItemType.Client)) {
      toast.error('只能添加一个客户端')
      return false
    }
  }
  const config: CanvasItem = {
    id: nanoid(),
    type,
    title: '服务器',
    status: 0,
    position: {
      x: initPosition.x,
      y: initPosition.y,
    },
    select: false,
    address: '',
    sid: -1,
    gid: -1,
  }
  switch (type) {
    case ItemType.GatewayServer:
      config.address = '127.0.0.1:10055'
      break
    case ItemType.ConfigServer:
      config.sid = configServers.value.length
      config.address = '127.0.0.1:9088'
      break
    case ItemType.StorageServer:
      config.sid = storageServers.value.length
      config.address = '127.0.0.1:9188'
      config.gid = 1
      break
    case ItemType.Client:
      break
  }
  items.value.push(config)
  return true
}

function deleteItem(index: number) {
  items.value.splice(index, 1)
  selectIndex.value = -1
  showInfoPanel.value = false
}

function boxSelectionStart(e: MouseEvent) {
  mousePosition.value = {
    x: e.clientX,
    y: e.clientY,
  }
  boxSelectionConfig.value = {
    enable: true,
    x: e.clientX,
    y: e.clientY,
    width: 0,
    height: 0,
  }
}

function boxSelectionCancel() {
  items.value.forEach((ele) => {
    ele.select = false
  })
}

function dragAddItem(type: ItemType, e: MouseEvent) {
  if (!draggingToolbarItem.value)
    return
  if (!canvasEl.value)
    return
  const bounding = canvasEl.value.getBoundingClientRect()
  const startPos = {
    x: Math.ceil((e.clientX - bounding.left - 20) / 20),
    y: Math.ceil((e.clientY - bounding.top - 20) / 20),
  }
  if (!addItem(type, startPos)) {
    dragEnd()
    return
  }

  dragStart(items.value.length - 1, e)
  draggingToolbarItem.value = false
}

function dragStart(index: number, e: MouseEvent) {
  dragging.value = true
  dragIndex.value = index
  prePosition.value = JSON.parse(JSON.stringify(items.value.map(ele => ele.position)))
  mousePosition.value = {
    x: e.clientX,
    y: e.clientY,
  }
}

function dragEnd() {
  dragging.value = false
  dragIndex.value = -1
  boxSelectionConfig.value.enable = false
}

function dragMove(e: MouseEvent) {
  if (boxSelectionConfig.value.enable) {
    if (!canvasEl.value)
      return
    boxSelectionConfig.value.width = e.clientX - boxSelectionConfig.value.x
    boxSelectionConfig.value.height = e.clientY - boxSelectionConfig.value.y
    const bounding = canvasEl.value.getBoundingClientRect()
    const itemWidth = 40
    const boxLeft = boxSelectionConfig.value.width > 0 ? boxSelectionConfig.value.x : boxSelectionConfig.value.x + boxSelectionConfig.value.width
    const boxTop = boxSelectionConfig.value.height > 0 ? boxSelectionConfig.value.y : boxSelectionConfig.value.y + boxSelectionConfig.value.height
    const boxWidth = Math.abs(boxSelectionConfig.value.width)
    const boxHeight = Math.abs(boxSelectionConfig.value.height)
    items.value.forEach((ele) => {
      const leftFit = ele.position.x * 20 + bounding.left >= boxLeft && ele.position.x * 20 + bounding.left + itemWidth <= boxLeft + boxWidth
      const topFit = ele.position.y * 20 + bounding.top >= boxTop && ele.position.y * 20 + bounding.top + itemWidth <= boxHeight + boxTop
      ele.select = leftFit && topFit
    })
    return
  }
  if (dragging.value) {
    const item = items.value[dragIndex.value]
    if (item.select) {
      items.value.forEach((ele, idx) => {
        if (ele.select) {
          ele.position.x = prePosition.value[idx].x + Math.ceil((e.clientX - mousePosition.value.x) / 20)
          ele.position.y = prePosition.value[idx].y + Math.ceil((e.clientY - mousePosition.value.y) / 20)
        }
      })
    }
    else {
      item.position.x = prePosition.value[dragIndex.value].x + Math.ceil((e.clientX - mousePosition.value.x) / 20)
      item.position.y = prePosition.value[dragIndex.value].y + Math.ceil((e.clientY - mousePosition.value.y) / 20)
    }
  }
}

function deleteSelectedItems() {
  items.value = items.value.filter(ele => !ele.select)
}

function clearLog() {
  serviceLogs.value = []
  raftLogs.value = []
}

function playHeartbeatAnimation(log: any) {
  let fromItem: any
  let toItem: any
  let fromPos: any
  let toPos: any
  if (log.SvrType === 'configserver') {
    fromItem = configServers.value.find(ele => ele.sid === Number(log.From))
    fromPos = fromItem?.position
    toItem = configServers.value.find(ele => ele.sid === Number(log.To))
    toPos = toItem?.position
  }
  if (log.SvrType === 'sharedserver') {
    const gid = Number(log.GroupId)
    fromItem = storageServers.value.filter(ele => ele.gid === gid).find(ele => ele.sid === Number(log.From))
    fromPos = fromItem?.position
    toItem = storageServers.value.filter(ele => ele.gid === gid).find(ele => ele.sid === Number(log.To))
    toPos = toItem?.position
  }
  if (fromPos === undefined || toPos === undefined)
    return
  const ele = document.createElement('div')
  ele.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
</svg>`
  ele.className = 'absolute transition-all duration-1000 ease-in-out w-[20px] h-[20px] text-red-500'
  ele.style.transform = `translate(${fromPos.x * 20 + 10}px, ${fromPos.y * 20 + 10}px)`
  canvasEl.value?.appendChild(ele)
  fromItem.status = 4
  setTimeout(() => {
    ele.style.transform = `translate(${toPos.x * 20 + 10}px, ${toPos.y * 20 + 10}px)`
  }, 100)
  setTimeout(() => {
    toItem.status = 3
    setTimeout(() => {
      toItem.status = 1
    }, 150)
  }, 1000)
  setTimeout(() => {
    ele.remove()
  }, 1100)
}

function playConfigGetAnimation(log: any) {
  const gid = Number(log.GroupId)
  const fromPos = configServers.value.find(ele => ele.sid === Number(log.To))?.position
  const toPos = storageServers.value.filter(ele => ele.gid === gid).find(ele => ele.sid === Number(log.From))?.position
  if (fromPos === undefined || toPos === undefined)
    return
  const ele = document.createElement('div')
  ele.innerHTML = `<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <path d="M918.905263 328.757895c35.031579 0 61.978947-26.947368 61.978948-61.978948V97.010526c0-32.336842-26.947368-61.978947-61.978948-61.978947H105.094737c-35.031579 0-61.978947 26.947368-61.978948 61.978947V269.473684c0 35.031579 26.947368 61.978947 61.978948 61.978948h72.757895v35.031579H105.094737c-35.031579 0-61.978947 26.947368-61.978948 61.978947v172.463158c0 35.031579 26.947368 61.978947 61.978948 61.978947h72.757895v35.031579H105.094737c-35.031579 0-61.978947 26.947368-61.978948 61.978947v172.463158c0 35.031579 26.947368 61.978947 61.978948 61.978948H916.210526c35.031579 0 61.978947-26.947368 61.978948-61.978948V754.526316c0-32.336842-26.947368-61.978947-61.978948-61.978948h-72.757894v-35.031579H916.210526c35.031579 0 61.978947-26.947368 61.978948-61.978947v-172.463158c0-32.336842-26.947368-61.978947-61.978948-61.978947h-72.757894v-35.031579h75.452631zM80.842105 269.473684V97.010526c0-13.473684 10.778947-24.252632 24.252632-24.252631h813.810526c13.473684 0 24.252632 10.778947 24.252632 24.252631V269.473684c0 13.473684-10.778947 24.252632-24.252632 24.252632H105.094737c-13.473684-2.694737-24.252632-10.778947-24.252632-24.252632z m862.31579 485.052632v172.463158c0 13.473684-10.778947 24.252632-24.252632 24.252631H105.094737c-13.473684 0-24.252632-10.778947-24.252632-24.252631V754.526316c0-13.473684 10.778947-24.252632 24.252632-24.252632h813.810526c13.473684 2.694737 24.252632 10.778947 24.252632 24.252632z m-134.736842-59.284211H215.578947v-35.031579h592.842106v35.031579z m134.736842-269.473684v172.463158c0 13.473684-10.778947 24.252632-24.252632 24.252632H105.094737c-13.473684 0-24.252632-10.778947-24.252632-24.252632v-172.463158c0-13.473684 10.778947-24.252632 24.252632-24.252632h813.810526c13.473684 0 24.252632 10.778947 24.252632 24.252632z m-134.736842-61.978947H215.578947v-35.031579h592.842106v35.031579z" />
    <path d="M388.042105 183.242105c0-10.778947-8.084211-18.863158-18.863158-18.863158H150.905263c-10.778947 0-18.863158 8.084211-18.863158 18.863158s8.084211 18.863158 18.863158 18.863158h218.273684c10.778947 0 18.863158-8.084211 18.863158-18.863158zM576.673684 234.442105c26.947368 0 51.2-21.557895 51.2-51.2 0-26.947368-21.557895-51.2-51.2-51.2s-51.2 21.557895-51.2 51.2c0 26.947368 24.252632 51.2 51.2 51.2z m0-64.673684c8.084211 0 13.473684 5.389474 13.473684 13.473684s-5.389474 13.473684-13.473684 13.473684-13.473684-8.084211-13.473684-13.473684c0-8.084211 5.389474-13.473684 13.473684-13.473684zM708.715789 234.442105c26.947368 0 51.2-21.557895 51.2-51.2 0-26.947368-21.557895-51.2-51.2-51.2-26.947368 0-51.2 21.557895-51.2 51.2 0 26.947368 24.252632 51.2 51.2 51.2z m0-64.673684c8.084211 0 13.473684 5.389474 13.473685 13.473684s-5.389474 13.473684-13.473685 13.473684-13.473684-8.084211-13.473684-13.473684c0-8.084211 5.389474-13.473684 13.473684-13.473684zM840.757895 234.442105c26.947368 0 51.2-21.557895 51.2-51.2 0-26.947368-21.557895-51.2-51.2-51.2-26.947368 0-51.2 21.557895-51.2 51.2 0 26.947368 21.557895 51.2 51.2 51.2z m0-64.673684c8.084211 0 13.473684 5.389474 13.473684 13.473684s-5.389474 13.473684-13.473684 13.473684-13.473684-8.084211-13.473684-13.473684c0-8.084211 5.389474-13.473684 13.473684-13.473684zM369.178947 493.136842H150.905263c-10.778947 0-18.863158 8.084211-18.863158 18.863158s8.084211 18.863158 18.863158 18.863158h218.273684c10.778947 0 18.863158-8.084211 18.863158-18.863158s-8.084211-18.863158-18.863158-18.863158zM576.673684 460.8c-26.947368 0-51.2 21.557895-51.2 51.2 0 26.947368 21.557895 51.2 51.2 51.2s51.2-21.557895 51.2-51.2c0-26.947368-24.252632-51.2-51.2-51.2z m0 64.673684c-8.084211 0-13.473684-5.389474-13.473684-13.473684s5.389474-13.473684 13.473684-13.473684 13.473684 5.389474 13.473684 13.473684-5.389474 13.473684-13.473684 13.473684zM708.715789 460.8c-26.947368 0-51.2 21.557895-51.2 51.2 0 26.947368 21.557895 51.2 51.2 51.2 26.947368 0 51.2-21.557895 51.2-51.2 0-26.947368-24.252632-51.2-51.2-51.2z m0 64.673684c-8.084211 0-13.473684-5.389474-13.473684-13.473684s5.389474-13.473684 13.473684-13.473684 13.473684 5.389474 13.473685 13.473684-5.389474 13.473684-13.473685 13.473684zM789.557895 512c0 26.947368 21.557895 51.2 51.2 51.2 26.947368 0 51.2-21.557895 51.2-51.2 0-26.947368-21.557895-51.2-51.2-51.2-29.642105 0-51.2 24.252632-51.2 51.2z m51.2-13.473684c8.084211 0 13.473684 5.389474 13.473684 13.473684s-5.389474 13.473684-13.473684 13.473684-13.473684-5.389474-13.473684-13.473684 5.389474-13.473684 13.473684-13.473684zM369.178947 821.894737H150.905263c-10.778947 0-18.863158 8.084211-18.863158 18.863158s8.084211 18.863158 18.863158 18.863158h218.273684c10.778947 0 18.863158-8.084211 18.863158-18.863158s-8.084211-18.863158-18.863158-18.863158zM576.673684 789.557895c-26.947368 0-51.2 21.557895-51.2 51.2s21.557895 51.2 51.2 51.2 51.2-21.557895 51.2-51.2-24.252632-51.2-51.2-51.2z m0 64.673684c-8.084211 0-13.473684-5.389474-13.473684-13.473684s5.389474-13.473684 13.473684-13.473684 13.473684 5.389474 13.473684 13.473684-5.389474 13.473684-13.473684 13.473684zM708.715789 789.557895c-26.947368 0-51.2 21.557895-51.2 51.2s21.557895 51.2 51.2 51.2c26.947368 0 51.2-21.557895 51.2-51.2s-24.252632-51.2-51.2-51.2z m0 64.673684c-8.084211 0-13.473684-5.389474-13.473684-13.473684s5.389474-13.473684 13.473684-13.473684 13.473684 5.389474 13.473685 13.473684-5.389474 13.473684-13.473685 13.473684zM789.557895 840.757895c0 26.947368 21.557895 51.2 51.2 51.2 26.947368 0 51.2-21.557895 51.2-51.2s-21.557895-51.2-51.2-51.2c-29.642105 0-51.2 24.252632-51.2 51.2z m51.2-13.473684c8.084211 0 13.473684 5.389474 13.473684 13.473684s-5.389474 13.473684-13.473684 13.473684-13.473684-5.389474-13.473684-13.473684 5.389474-13.473684 13.473684-13.473684z" />
  </svg>`
  ele.className = 'absolute transition-all duration-1000 ease-in-out w-[20px] h-[20px] text-blue-500'
  ele.style.transform = `translate(${fromPos.x * 20 + 10}px, ${fromPos.y * 20 + 10}px)`
  canvasEl.value?.appendChild(ele)
  setTimeout(() => {
    ele.style.transform = `translate(${toPos.x * 20 + 10}px, ${toPos.y * 20 + 10}px)`
  }, 100)
  setTimeout(() => {
    ele.remove()
  }, 1100)
}

function playStoragePutAnimation(log: any) {
  const gid = Number(log.GroupId)
  const gateway = items.value.find(item => item.type === ItemType.GatewayServer)
  if (!gateway) {
    toast.error('请先添加网关服务器')
    return
  }
  const configLeader = configServers.value.find(item => item.status === 4)
  if (!configLeader) {
    toast.error('配置服务器可能初始化失败，请检查配置服务器状态')
    return
  }
  const storageLeader = storageServers.value.filter(item => item.gid === gid).find(item => item.status === 4)
  if (!storageLeader) {
    toast.error('存储服务器可能初始化失败，请检查存储服务器状态')
    return
  }
  if (Number(log.From) !== storageLeader.sid) {
    // eslint-disable-next-line no-console
    console.log('not leader')
    return
  }
  const storageFollower = storageServers.value.filter(item => item.gid === gid).filter(item => item.status !== 4)

  const client = items.value.find(item => item.type === ItemType.Client)
  if (!client) {
    toast.error('请先添加客户端')
    return
  }
  const msg = document.createElement('div')
  msg.innerHTML = `<div>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path fill-rule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97zM6.75 8.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z" clip-rule="evenodd" />
</svg>
  msg
</div>`
  msg.className = 'absolute transition-all duration-[3s] ease-in-out w-[20px] h-[20px] text-yellow-500'
  msg.style.transform = `translate(${client.position.x * 20 + 10}px, ${client.position.y * 20 + 10}px)`
  canvasEl.value?.appendChild(msg)
  setTimeout(() => {
    msg.style.transform = `translate(${gateway.position.x * 20 + 10}px, ${gateway.position.y * 20 + 10}px)`
  }, 100)
  setTimeout(() => {
    const key = document.createElement('div')
    key.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path fill-rule="evenodd" d="M15.75 1.5a6.75 6.75 0 00-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 00-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 00.75-.75v-1.5h1.5A.75.75 0 009 19.5V18h1.5a.75.75 0 00.53-.22l2.658-2.658c.19-.189.517-.288.906-.22A6.75 6.75 0 1015.75 1.5zm0 3a.75.75 0 000 1.5A2.25 2.25 0 0118 8.25a.75.75 0 001.5 0 3.75 3.75 0 00-3.75-3.75z" clip-rule="evenodd" />
</svg>
`
    key.className = 'absolute transition-all duration-[3s] ease-in-out w-[20px] h-[20px] text-yellow-500'
    key.style.transform = `translate(${gateway.position.x * 20 + 10}px, ${gateway.position.y * 20 + 10}px)`
    canvasEl.value?.appendChild(key)
    setTimeout(() => {
      key.style.transform = `translate(${configLeader.position.x * 20 + 10}px, ${configLeader.position.y * 20 + 10}px)`
    }, 100)
    setTimeout(() => {
      key.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path fill-rule="evenodd" d="M1.5 7.125c0-1.036.84-1.875 1.875-1.875h6c1.036 0 1.875.84 1.875 1.875v3.75c0 1.036-.84 1.875-1.875 1.875h-6A1.875 1.875 0 011.5 10.875v-3.75zm12 1.5c0-1.036.84-1.875 1.875-1.875h5.25c1.035 0 1.875.84 1.875 1.875v8.25c0 1.035-.84 1.875-1.875 1.875h-5.25a1.875 1.875 0 01-1.875-1.875v-8.25zM3 16.125c0-1.036.84-1.875 1.875-1.875h5.25c1.036 0 1.875.84 1.875 1.875v2.25c0 1.035-.84 1.875-1.875 1.875h-5.25A1.875 1.875 0 013 18.375v-2.25z" clip-rule="evenodd" />
</svg>
`
      key.style.transform = `translate(${gateway.position.x * 20 + 10}px, ${gateway.position.y * 20 + 10}px)`
    }, 3100)
    setTimeout(() => {
      key.remove()
    }, 6100)
  }, 3100)
  setTimeout(() => {
    msg.style.transform = `translate(${storageLeader.position.x * 20 + 10}px, ${storageLeader.position.y * 20 + 10}px)`
    setTimeout(() => {
      storageFollower.forEach((item) => {
        const msg = document.createElement('div')
        msg.innerHTML = `<div>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path fill-rule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97zM6.75 8.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z" clip-rule="evenodd" />
</svg>
  msg
</div>`
        msg.className = 'absolute transition-all duration-[3s] ease-in-out w-[20px] h-[20px] text-yellow-500'
        msg.style.transform = `translate(${storageLeader.position.x * 20 + 10}px, ${storageLeader.position.y * 20 + 10}px)`
        canvasEl.value?.appendChild(msg)
        setTimeout(() => {
          msg.style.transform = `translate(${item.position.x * 20 + 10}px, ${item.position.y * 20 + 10}px)`
        }, 100)
        setTimeout(() => {
          msg.remove()
        }, 3100)
      })
    }, 3000)
    setTimeout(() => {
      msg.remove()
    }, 6100)
  }, 9200)
}

function playStorageGetAnimation(log: any) {
  const gid = Number(log.GroupId)
  const gateway = items.value.find(item => item.type === ItemType.GatewayServer)
  if (!gateway) {
    toast.error('请先添加网关服务器')
    return
  }
  const configLeader = configServers.value.find(item => item.status === 4)
  if (!configLeader) {
    toast.error('配置服务器可能初始化失败，请检查配置服务器状态')
    return
  }
  const storageLeader = storageServers.value.filter(item => item.gid === gid).find(item => item.status === 4)
  if (!storageLeader) {
    toast.error('存储服务器可能初始化失败，请检查存储服务器状态')
    return
  }
  if (Number(log.From) !== storageLeader.sid) {
    // eslint-disable-next-line no-console
    console.log('not leader')
    return
  }
  const client = items.value.find(item => item.type === ItemType.Client)
  if (!client) {
    toast.error('请先添加客户端')
    return
  }
  const msg = document.createElement('div')
  msg.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path fill-rule="evenodd" d="M15.75 1.5a6.75 6.75 0 00-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 00-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 00.75-.75v-1.5h1.5A.75.75 0 009 19.5V18h1.5a.75.75 0 00.53-.22l2.658-2.658c.19-.189.517-.288.906-.22A6.75 6.75 0 1015.75 1.5zm0 3a.75.75 0 000 1.5A2.25 2.25 0 0118 8.25a.75.75 0 001.5 0 3.75 3.75 0 00-3.75-3.75z" clip-rule="evenodd" />
</svg>
`
  msg.className = 'absolute transition-all duration-[3s] ease-in-out w-[20px] h-[20px] text-purple-300'
  msg.style.transform = `translate(${client.position.x * 20 + 10}px, ${client.position.y * 20 + 10}px)`
  canvasEl.value?.appendChild(msg)
  setTimeout(() => {
    msg.style.transform = `translate(${gateway.position.x * 20 + 10}px, ${gateway.position.y * 20 + 10}px)`
  }, 100)
  setTimeout(() => {
    const key = document.createElement('div')
    key.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path fill-rule="evenodd" d="M15.75 1.5a6.75 6.75 0 00-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 00-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 00.75-.75v-1.5h1.5A.75.75 0 009 19.5V18h1.5a.75.75 0 00.53-.22l2.658-2.658c.19-.189.517-.288.906-.22A6.75 6.75 0 1015.75 1.5zm0 3a.75.75 0 000 1.5A2.25 2.25 0 0118 8.25a.75.75 0 001.5 0 3.75 3.75 0 00-3.75-3.75z" clip-rule="evenodd" />
</svg>
`
    key.className = 'absolute transition-all duration-[3s] ease-in-out w-[20px] h-[20px] text-purple-300'
    key.style.transform = `translate(${gateway.position.x * 20 + 10}px, ${gateway.position.y * 20 + 10}px)`
    canvasEl.value?.appendChild(key)
    setTimeout(() => {
      key.style.transform = `translate(${configLeader.position.x * 20 + 10}px, ${configLeader.position.y * 20 + 10}px)`
    }, 100)
    setTimeout(() => {
      key.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path fill-rule="evenodd" d="M1.5 7.125c0-1.036.84-1.875 1.875-1.875h6c1.036 0 1.875.84 1.875 1.875v3.75c0 1.036-.84 1.875-1.875 1.875h-6A1.875 1.875 0 011.5 10.875v-3.75zm12 1.5c0-1.036.84-1.875 1.875-1.875h5.25c1.035 0 1.875.84 1.875 1.875v8.25c0 1.035-.84 1.875-1.875 1.875h-5.25a1.875 1.875 0 01-1.875-1.875v-8.25zM3 16.125c0-1.036.84-1.875 1.875-1.875h5.25c1.036 0 1.875.84 1.875 1.875v2.25c0 1.035-.84 1.875-1.875 1.875h-5.25A1.875 1.875 0 013 18.375v-2.25z" clip-rule="evenodd" />
</svg>
`
      key.style.transform = `translate(${gateway.position.x * 20 + 10}px, ${gateway.position.y * 20 + 10}px)`
    }, 3100)
    setTimeout(() => {
      key.remove()
    }, 6100)
  }, 3100)
  setTimeout(() => {
    msg.style.transform = `translate(${storageLeader.position.x * 20 + 10}px, ${storageLeader.position.y * 20 + 10}px)`
  }, 9200)
  setTimeout(() => {
    msg.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path fill-rule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97zM6.75 8.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z" clip-rule="evenodd" />
</svg>
`
    msg.style.transform = `translate(${gateway.position.x * 20 + 10}px, ${gateway.position.y * 20 + 10}px)`
  }, 12200)
  setTimeout(() => {
    msg.style.transform = `translate(${client.position.x * 20 + 10}px, ${client.position.y * 20 + 10}px)`
  }, 15200)
  setTimeout(() => {
    msg.remove()
  }, 18200)
}

// 网关相关函数

function connectGateway() {
  const gateway = items.value.find(item => item.type === ItemType.GatewayServer)
  if (!gateway) {
    toast.error('请先添加网关服务器')
    return
  }
  socket = new WebSocket(`ws://${gateway.address}/log`)

  socket.addEventListener('open', () => {
    toast.success('网关连接成功')
    gateway.status = 1
  })

  socket.addEventListener('message', (event) => {
    let res: any
    try {
      res = JSON.parse(event.data)
      // logs.value.push(`[${timestampToTime(Date.now())}][${timestampToTime(res.Time)}] ${event.data} `)
      // logs.value.push(`[${formatTimeMs(res.Time)}] ${event.data} `)
    }
    catch (err) {
      toast.error(`数据解析失败：${event.data}`)
    }
    if (res) {
      // eslint-disable-next-line no-console
      console.log(res)
      if (res.Layer === 'SERVICE') {
        serviceLogs.value.push(event.data)
        if (serviceLogEl.value)
          serviceLogEl.value.scrollTo({ top: serviceLogEl.value.scrollHeight, behavior: 'smooth' })
      }
      else if (res.Layer === 'RAFT') {
        raftLogs.value.push(event.data)
        if (raftLogEl.value)
          raftLogEl.value.scrollTo({ top: raftLogEl.value.scrollHeight, behavior: 'smooth' })
      }

      if (res.Logtype === 'HeartBeat') {
        playHeartbeatAnimation(res)
      }
      else if (res.Logtype === 'StartSucess') {
        if (res.SvrType === 'configserver') {
          const item = configServers.value.find(ele => ele.sid === Number(res.From))
          if (item)
            item.status = 1
        }
        if (res.SvrType === 'sharedserver') {
          const item = storageServers.value.filter(ele => ele.gid === Number(res.GroupId)).find(ele => ele.sid === Number(res.From))
          if (item)
            item.status = 1
        }
      }
      else if (res.Logtype === 'ListenConfigSuccess') {
        playConfigGetAnimation(res)
      }
      else if (res.Logtype === 'PutKv') {
        playStoragePutAnimation(res)
      }
      else if (res.Logtype === 'GetKv') {
        playStorageGetAnimation(res)
      }
    }
  })

  socket.addEventListener('close', () => {
    toast.error('网关连接断开')
    gateway.status = 0
  })
}

function disconnectGateway() {
  const gateway = items.value.find(ele => ele.type === ItemType.GatewayServer)
  if (!gateway) {
    toast.info('请先添加网关服务')
    return
  }
  setTimeout(() => {
    items.value.forEach((item) => {
      item.status = 0
    })
  }, 1000)
  gatewayDisconnect(`http://${gateway.address}`)
}

function startServer(id: string) {
  const item = items.value.find(ele => ele.id === id)
  const gateway = items.value.find(ele => ele.type === ItemType.GatewayServer)
  if (!gateway) {
    toast.info('请先添加网关服务')
    return
  }
  if (!item) {
    toast.error('未找到对应服务')
    return
  }
  if (item.type === ItemType.ConfigServer) {
    const cfg_addrs = configServers.value.map(ele => ele.address).join(',')
    gatewayStartServer(`http://${gateway.address}`, -1, item.sid, 'configserver', cfg_addrs, undefined)
      .then(() => {
        toast.success('发送启动请求成功')
      })
      .catch(() => {
        toast.error('发送启动请求失败')
      })
    return
  }
  if (item.type === ItemType.StorageServer) {
    const cfg_addrs = configServers.value.map(ele => ele.address).join(',')
    const shared_addrs = storageServers.value.filter(ele => ele.gid === item.gid).map(ele => ele.address).join(',')
    gatewayStartServer(`http://${gateway.address}`, item.gid, item.sid, 'sharedserver', cfg_addrs, shared_addrs)
      .then(() => {
        toast.success('发送启动请求成功')
      })
      .catch(() => {
        toast.error('发送启动请求失败')
      })
  }
}

function stopServer(id: string) {
  const item = items.value.find(ele => ele.id === id)
  const gateway = items.value.find(ele => ele.type === ItemType.GatewayServer)
  if (!gateway) {
    toast.info('请先添加网关服务')
    return
  }
  if (!item) {
    toast.error('未找到对应服务')
    return
  }
  if (item.type === ItemType.ConfigServer) {
    gatewayStopServer(`http://${gateway.address}`, 'configserver', -1, item.sid)
      .then(() => {
        toast.success('发送关闭请求成功')
      })
      .catch(() => {
        toast.error('发送关闭请求失败')
      })
  }
  if (item.type === ItemType.StorageServer) {
    gatewayStopServer(`http://${gateway.address}`, 'sharedserver', item.gid, item.sid)
      .then(() => {
        toast.success('发送关闭请求成功')
      })
      .catch(() => {
        toast.error('发送关闭请求失败')
      })
  }
}

function setGroupInfo() {
  const gateway = items.value.find(ele => ele.type === ItemType.GatewayServer)
  if (!gateway) {
    toast.info('请先添加网关服务')
    return
  }

  for (const group of groupList.value) {
    const shared_addrs = storageServers.value.filter(ele => ele.gid === group).map(ele => ele.address).join(',')
    setGroup(`http://${gateway.address}`, group, shared_addrs)
      .then(() => {
        toast.success('发送分组请求成功')
      })
      .catch(() => {
        toast.error('发送分组请求失败')
      })
  }
}

function setBucketInfo() {
  const gateway = items.value.find(ele => ele.type === ItemType.GatewayServer)
  if (!gateway) {
    toast.info('请先添加网关服务')
    return
  }
  bucketConfig.value.forEach((gid, idx) => {
    updateBucket(`http://${gateway.address}`, gid, `${idx}-${idx}`)
  })
}

function setStorageKv() {
  const gateway = items.value.find(ele => ele.type === ItemType.GatewayServer)
  if (!gateway) {
    toast.info('请先添加网关服务')
    return
  }
  putKv(`http://${gateway.address}`, clientConfig.value.key, clientConfig.value.value)
    .then(() => {
      toast.success('发送请求成功')
    })
    .catch(() => {
      toast.error('发送请求失败')
    })
}

function getStorageKv() {
  const gateway = items.value.find(ele => ele.type === ItemType.GatewayServer)
  if (!gateway) {
    toast.info('请先添加网关服务')
    return
  }
  getKv(`http://${gateway.address}`, clientConfig.value.key)
    .then((res: any) => {
      toast.success(res.data)
    })
    .catch(() => {
      toast.error('发送请求失败')
    })
}
</script>
