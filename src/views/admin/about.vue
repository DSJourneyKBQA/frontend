<template>
  <div>
    <p class="mb-4 text-2xl font-bold">
      关于
    </p>
    <p class="font-bold text-4xl mb-4">
      DS Journey 分布式体验与学习平台
    </p>
    <p><strong>程序版本：</strong><a class="relative z-10 after:link hover:after:link-hover hover:text-white transition-colors" :href="`${frontendRepo}/tree/${commitHash}`">{{ commitHash }}</a></p>
    <p><strong>构建时间：</strong>{{ buildTime === 'dev' ? 'dev' : formatTime(buildTime) }}</p>
    <p><strong>Vue版本：</strong>{{ versionVue }}</p>
    <p><strong>作者：</strong><a class="relative z-10 after:link hover:after:link-hover hover:text-white transition-colors" href="https://github.com/DSJourneyKBQA" target="_blank">DS Journey 开发团队</a></p>
    <p><strong>前端仓库：</strong><a class="relative z-10 after:link hover:after:link-hover hover:text-white transition-colors" :href="frontendRepo" target="_blank">{{ frontendRepo }}</a></p>
    <p><strong>后端仓库：</strong><a class="relative z-10 after:link hover:after:link-hover hover:text-white transition-colors" :href="backendRepo" target="_blank">{{ backendRepo }}</a></p>
  </div>
</template>

<script setup lang="ts">
import { version as versionVue } from 'vue'
import { backendRepo, frontendRepo } from '@/config'
import { formatTime } from '@/utils'

const commitHash = window.__BUILD_COMMIT__ || 'dev'
const buildTime = window.__BUILD_TIME__ || 'dev'
</script>
