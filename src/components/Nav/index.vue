<template>
  <div class="h-[60px] z-50">
    <div
      class="w-full h-[60px] fixed top-0 left-0 shadow-md flex justify-between z-50"
      :class="{
        'bg-white': navTheme === 'light',
        'bg-[#2d333b] text-[#cdd9e5]': navTheme === 'dark',
      }"
    >
      <div>
        <RouterLink to="/">
          <div class="leading-[60px] px-10 inline-block hover:bg-gray-500/20 transition-colors">
            首页
          </div>
        </RouterLink>
        <RouterLink to="/study">
          <div class="leading-[60px] px-10 inline-block hover:bg-gray-500/20 transition-colors">
            学习
          </div>
        </RouterLink>
        <RouterLink to="/try">
          <div class="leading-[60px] px-10 inline-block hover:bg-gray-500/20 transition-colors">
            体验
          </div>
        </RouterLink>
        <RouterLink to="/blog">
          <div class="leading-[60px] px-10 inline-block hover:bg-gray-500/20 transition-colors">
            博客
          </div>
        </RouterLink>
      </div>
      <RouterLink to="/user">
        <div class="leading-[60px] px-6">
          个人中心
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from '@/store'

const store = useStore()
const { navTheme } = toRefs(store)
</script>
