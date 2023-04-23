<template>
  <div class="h-[calc(100vh-60px)] bg-[#1c2128] w-full flex">
    <div class="flex-1 flex h-full items-center justify-center">
      <div class="bg-[#22272e] w-[60px] h-full shrink-0 border-r border-[#373e47]">
        <ExperienceToolBarItem
          v-for="itemType in itemTypeList" :key="itemType.value"
          title="服务器"
          @dblclick="addItem(itemType.value)"
          @mousedown="draggingToolbarItem = true"
          @mouseup="draggingToolbarItem = false"
          @mouseleave="dragAddItem(itemType.value, $event)"
        >
          <IconDynamic :type="itemType.value" class="w-8 h-8 text-white" />
        </ExperienceToolBarItem>
      </div>
      <div
        ref="canvasEl"
        class="bg-[#1c2128] flex-1 h-full overflow-hidden"
        @dblclick="boxSelectionCancel"
        @mousedown="boxSelectionStart"
        @mouseup="dragEnd"
        @mouseleave="dragEnd"
        @mousemove="dragMove"
      >
        <ExperienceCanvasItem
          v-for="item, index in items" :key="index"
          :index="index"
          :type="item.type"
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
            left: `${boxSelectionConfig.width > 0 ? boxSelectionConfig.x : boxSelectionConfig.x + boxSelectionConfig.width}px`,
            top: `${boxSelectionConfig.height > 0 ? boxSelectionConfig.y : boxSelectionConfig.y + boxSelectionConfig.height}px`,
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
      <div v-if="selectIndex !== -1" class="w-[400px] p-4">
        <button
          class="absolute right-0 top-0 p-2"
          @click="showInfoPanel = false"
        >
          x
        </button>
        <div>当前选中项目：ID：{{ items[selectIndex].id }}, 类型：{{ items[selectIndex].type }}</div>
        <button class="border px-2 py-0.5 mr-2 my-1 bg-[#373e47] hover:bg-[#444c56] border-[#464e57] hover:border-[#768390] rounded-md">
          启动
        </button>
        <button class="border px-2 py-0.5 mr-2 my-1 bg-[#373e47] hover:bg-[#444c56] border-[#464e57] hover:border-[#768390] rounded-md">
          关闭
        </button>
        <button class="border px-2 py-0.5 mr-2 my-1 bg-[#373e47] hover:bg-[#444c56] border-[#464e57] hover:border-[#768390] rounded-md" @click="deleteItem(selectIndex)">
          删除
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { itemTypeList } from '@/constants'
import type { ItemType } from '@/enums'
import { useStore } from '@/store'

interface Item {
  id: number
  type: ItemType
  title: string
  position: {
    x: number
    y: number
  }
  select: boolean
}
const store = useStore()

const items = ref<Item[]>([])
const dragging = ref(false)
const dragIndex = ref(-1)
const draggingToolbarItem = ref(false)

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

let idInc = 0

onMounted(() => {
  items.value = JSON.parse(localStorage.getItem('items') || '[]')
  configLoaded.value = true
  store.navTheme = 'dark'
})

onUnmounted(() => {
  store.navTheme = 'light'
})

function addItem(type: ItemType, initPosition: { x: number; y: number } = { x: 5, y: 5 }) {
  items.value.push({
    id: idInc++,
    type,
    title: '服务器',
    position: {
      x: initPosition.x,
      y: initPosition.y,
    },
    select: false,
  })
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
  addItem(type, startPos)
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

function deleteItem(index: number) {
  items.value.splice(index, 1)
  selectIndex.value = -1
  showInfoPanel.value = false
}

watchEffect(() => {
  if (!configLoaded.value)
    return
  localStorage.setItem('items', JSON.stringify(items.value))
})
</script>
