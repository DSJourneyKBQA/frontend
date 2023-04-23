<template>
  <div>user-setting</div>
  <div>
    <p class="mb-4 text-2xl font-bold">
      用户设置
    </p>
    <div class="flex items-center p-1">
      <span>根本对不齐的自动对齐</span>
      <CommonSwitch v-model="setting.autoAlign" class="ml-2" />
    </div>
    <div class="flex items-center p-1">
      <span>使用旧版编辑器</span>
      <CommonSwitch v-model="setting.legacyEditor" class="ml-2" />
    </div>
    <div class="flex items-center p-1">
      <span>固定输入框高度(旧版编辑器)</span>
      <CommonSwitch v-model="setting.stickyTextarea" class="ml-2" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
import { useStore } from '@/store'

const store = useStore()
const { setting } = toRefs(store)
</script>
