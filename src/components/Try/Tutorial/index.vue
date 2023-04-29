<template>
  <Transition name="popup-b">
    <div class="bg-[#22272e] border border-[#444c56] rounded-lg p-4 text-[#cdd9e5] max-w-[300px] select-none">
      <div class="flex justify-between items-center">
        <div class="font-bold">
          体验模块教程
        </div>
        <IconClose
          class="w-5 h-5 cursor-pointer"
          @click="$emit('close')"
        />
      </div>
      <div class="my-4">
        {{ tutorialList[tutorialIndex] }}
      </div>
      <div class="flex justify-between text-sm">
        <div
          class="border-b border-transparent transition-all duration-300"
          :class="{
            'opacity-50': tutorialIndex === 0,
            'hover:border-[#cdd9e5] cursor-pointer': tutorialIndex !== 0,
          }"
          @click="prev"
        >
          上一步
        </div>
        <div
          class="border-b border-transparent  transition-all duration-300"
          :class="{
            'opacity-50': tutorialIndex === tutorialList.length - 1,
            'hover:border-[#cdd9e5] cursor-pointer': tutorialIndex !== tutorialList.length - 1,
          }"
          @click="next"
        >
          下一步
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineEmits(['close'])

const tutorialList = ref([
  '使用工具栏添加一个网关服务器',
  '使用安装脚本在服务器中安装网关服务器，并开启服务器',
  '点击画布中的网关服务器，将服务器IP地址与端口号填入连接地址中，并点击[连接网关]，图标变为绿色则表示连接成功',
  '使用工具栏添加至少两个配置服务器，并点击[开启]，图标变为绿色则表示开启成功',
  '使用工具栏添加至少两台存储服务器，填写组号，并点击[开启]，图标变为绿色则表示开启成功',
  '进入任意配置服务器的配置页面，点击设置分组信息，再点击设置路由表',
  '使用工具栏添加一个客户端',
  '填写key与value值，点击[Put]，即可将数据存储至服务器',
  '填写key，点击[Get]，即可将从服务器中取出数据',
])
const tutorialIndex = ref(0)

function prev() {
  if (tutorialIndex.value > 0)
    tutorialIndex.value--
}

function next() {
  if (tutorialIndex.value < tutorialList.value.length - 1)
    tutorialIndex.value++
}
</script>
