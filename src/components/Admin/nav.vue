import NormalButton from './common/button/NormalButton.vue';

<template>
  <div class="h-[60px] w-full">
    <div
      class="flxed h-[60px] w-full top-0 left-0 bg-white shadow-md z-[99] flex justify-between items-center px-4 text-lg font-bold"
    >
      <div class="flex items-center">
        分布式体验与学习平台 - 管理后台
      </div>
      <div>
        <CommonButton icon @click="$router.push('/user')">
          <IconExit class="w-4 h-4" />
        </CommonButton>
      </div>
    </div>
  </div>
</template>
