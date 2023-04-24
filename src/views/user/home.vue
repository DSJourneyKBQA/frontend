<template>
  <div class="h-[calc(100vh-60px)] flex flex-col items-center justify-center main-page">
    <div class="font-bold text-3xl text-white">
      欢迎来到XXX分布式学习系统
    </div>
    <button
      class="px-4 py-2 my-4 font-semibold bg-green-300 hover:bg-green-400 border border-green-400 rounded-full transition-colors"
      @click="$router.push('/study')"
    >
      开始分布式学习之旅
    </button>
  </div>
</template>

<script setup lang="ts">
</script>

<style>
.main-page {
  background-image: url('@/assets/img/bg.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
