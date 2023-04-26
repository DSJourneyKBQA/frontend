<template>
  <div class="h-[calc(100vh-60px)] bg-[#1c2128] w-full flex">
    <div class="flex-1 flex h-full items-center justify-center">
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
        class="bg-[#1c2128] flex-1 h-full overflow-hidden relative"
        @dblclick="boxSelectionCancel"
        @mousedown="boxSelectionStart"
        @mouseup="dragEnd"
        @mouseleave="dragEnd"
        @mousemove="dragMove"
      >
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
        'w-[400px]': showInfoPanel,
        'w-0': !showInfoPanel,
      }"
    >
      <div v-if="selectIndex !== -1" class="w-[400px] h-full p-4 overflow-x-hidden overflow-y-auto flex flex-col">
        <button
          class="absolute right-0 top-0 p-2"
          @click="showInfoPanel = false"
        >
          x
        </button>
        <div>{{ items[selectIndex].id }}</div>
        <div>类型：{{ items[selectIndex].type }}</div>
        <div>
          <button
            class="border px-2 py-0.5 mr-2 my-1 bg-[#373e47] hover:bg-[#444c56] border-[#464e57] hover:border-[#768390] rounded-md"
            @click="startServer(items[selectIndex].id) "
          >
            启动
          </button>
          <button
            class="border px-2 py-0.5 mr-2 my-1 bg-[#373e47] hover:bg-[#444c56] border-[#464e57] hover:border-[#768390] rounded-md"
            @click="stopServer(items[selectIndex].id) "
          >
            关闭
          </button>
          <button
            class="border px-2 py-0.5 mr-2 my-1 bg-[#373e47] hover:bg-[#444c56] border-[#464e57] hover:border-[#768390] rounded-md"
            @click=" deleteItem(selectIndex) "
          >
            删除
          </button>
          <button
            class="border px-2 py-0.5 mr-2 my-1 bg-[#373e47] hover:bg-[#444c56] border-[#464e57] hover:border-[#768390] rounded-md"
            @click=" logs = [] "
          >
            清空
          </button>
        </div>

        <div v-if=" items[selectIndex].type === ItemType.GatewayServer">
          <button
            class="border px-2 py-0.5 mr-2 my-1 bg-[#373e47] hover:bg-[#444c56] border-[#464e57] hover:border-[#768390] rounded-md"
            @click="connectGateway "
          >
            连接网关
          </button>
          <button
            class="border px-2 py-0.5 mr-2 my-1 bg-[#373e47] hover:bg-[#444c56] border-[#464e57] hover:border-[#768390] rounded-md"
            @click="disconnectGateway "
          >
            断开网关
          </button>
          <div>
            连接地址：<input v-model="items[selectIndex].address" type="text" class="bg-transparent">
          </div>
        </div>

        <div v-if="items[selectIndex].type === ItemType.ConfigServer">
          <div>
            ID：<input v-model="items[selectIndex].sid" type="text" class="bg-transparent">
          </div>
          <div>
            地址：<input v-model=" items[selectIndex].address" type="text" class="bg-transparent">
          </div>
          路由表：
          <div>
            <div v-for="i in 15" :key="i" class="w-4 h-4 bg-white inline-block mx-0.5 text-black leading-4 text-center">
              1
            </div>
          </div>
          <div v-for="gid in groupList" :key="gid">
            Group: {{ gid }}
            <div class="border w-fit p-1">
              <div v-for=" server, index in ['127.0.0.1:9088', '127.0.0.1:9099', '127.0.0.1:9100'] " :key=" index ">
                {{ server }}
              </div>
            </div>
          </div>
        </div>

        <div v-if="items[selectIndex].type === ItemType.StorageServer">
          地址：<input v-model="items[selectIndex].address " type="text" class="bg-transparent">
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

        <div class="my-1">
          日志
        </div>
        <div class="flex-1 flex overflow-y-auto flex-col p-1 border border-[#768390] rounded-md">
          <div v-for="log, index in logs" :key="index">
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
import { formatTime, formatTimeMs } from '@/utils'
import type { CanvasItem } from '@/types'
import { gatewayDisconnect, gatewayStartServer, gatewayStopServer } from '@/api/try'

const store = useStore()
const toast = useToast()

const items = ref<CanvasItem[]>([])
const dragging = ref(false)
const dragIndex = ref(-1)
const draggingToolbarItem = ref(false)
const logs = ref<string[]>([])

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
const configLoaded = ref(false)
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

let socket: WebSocket

onMounted(() => {
  items.value = JSON.parse(localStorage.getItem('items') || '[]')
  items.value.forEach((item) => {
    item.status = 0
  })
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

function playHeartbeatAnimation(from: number, to: number) {
  const fromPos = configServers.value.find(ele => ele.sid === from)?.position
  const toPos = configServers.value.find(ele => ele.sid === to)?.position
  if (fromPos === undefined || toPos === undefined)
    return
  const ele = document.createElement('div')
  ele.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
</svg>`
  ele.className = 'absolute transition-all duration-1000 ease-in-out w-[20px] h-[20px] text-red-500'
  ele.style.transform = `translate(${fromPos.x * 20 + 10}px, ${fromPos.y * 20 + 10}px)`
  canvasEl.value?.appendChild(ele)
  setTimeout(() => {
    ele.style.transform = `translate(${toPos.x * 20 + 10}px, ${toPos.y * 20 + 10}px)`
  }, 100)
  setTimeout(() => {
    ele.remove()
  }, 1100)
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
    logs.value.push(`[${formatTime(Date.now())}] 网关连接成功`)
    toast.success('网关连接成功')
  })

  socket.addEventListener('message', (event) => {
    let res: any
    try {
      res = JSON.parse(event.data)
      // logs.value.push(`[${timestampToTime(Date.now())}][${timestampToTime(res.Time)}] ${event.data} `)
      logs.value.push(`[${formatTimeMs(res.Time)}] ${event.data} `)
    }
    catch (err) {
      toast.error(`数据解析失败：${event.data}`)
    }
    if (res) {
      if (res.Logtype === 'HeartBeat')
        playHeartbeatAnimation(Number(res.From), Number(res.To))
      if (res.Logtype === 'StartSucess') {
        if (res.SvrType === 'configserver')
          configServers.value.find(ele => ele.sid === Number(res.From)).status = 1
      }
    }
  })

  socket.addEventListener('close', () => {
    logs.value.push(`[${formatTime(Date.now())}] 网关连接断开`)
    toast.error('网关连接断开')
    socket.removeEventListener('open', () => { })
    socket.removeEventListener('message', () => { })
    socket.removeEventListener('close', () => { })
  })
}

function disconnectGateway() {
  const gateway = items.value.find(ele => ele.type === ItemType.GatewayServer)
  if (!gateway) {
    toast.info('请先添加网关服务')
    return
  }
  items.value.forEach((item) => {
    item.status = 0
  })
  gatewayDisconnect(gateway.address)
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
    gatewayStartServer(`http://${gateway.address}`, item.sid, 'configserver', cfg_addrs)
      .then(() => {
        toast.success('发送启动请求成功')
      })
      .catch(() => {
        toast.error('发送启动请求失败')
      })
    return
  }
  console.log('test')
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
    gatewayStopServer(`http://${gateway.address}`, item.sid, 'configserver')
      .then(() => {
        toast.success('发送关闭请求成功')
      })
      .catch(() => {
        toast.error('发送关闭请求失败')
      })
    return
  }
  console.log('test')
}
</script>
