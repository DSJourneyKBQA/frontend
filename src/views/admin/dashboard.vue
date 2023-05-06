<template>
  <div>
    <p class="mb-4 text-2xl font-bold">
      仪表盘
    </p>
    <div v-if="dashboardData" class="flex flex-wrap gap-6">
      <div class="flex-1 flex flex-col items-center justify-center min-w-[300px] h-[150px] rounded-lg text-2xl hover:scale-105 transition-all bg-red-200">
        <div>用户总数</div>
        <div>{{ dashboardData.userCount }}</div>
      </div>
      <div class="flex-1 flex flex-col items-center justify-center min-w-[300px] h-[150px] rounded-lg text-2xl hover:scale-105 transition-all bg-green-200">
        <div>文章总数</div>
        <div>{{ dashboardData.postCount }}</div>
      </div>
      <div class="flex-1 flex flex-col items-center justify-center min-w-[300px] h-[150px] rounded-lg text-2xl hover:scale-105 transition-all bg-blue-200">
        <div> 评论总数</div>
        <div>{{ dashboardData.commentCount }}</div>
      </div>
      <div class="flex-1 flex flex-col items-center justify-center min-w-[300px] h-[150px] rounded-lg text-2xl hover:scale-105 transition-all bg-yellow-200">
        <div>最新注册用户</div>
        <div class="text-base">
          {{ dashboardData.latestUser.nickname }}({{ dashboardData.latestUser.name }})[{{ dashboardData.latestUser.uid }}]
        </div>
        <div class="text-base">
          {{ formatTime(dashboardData.latestUser.createdAt) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import NProgress from 'nprogress'
import { useToast } from 'vue-toastification'
import { getDashboardData } from '@/api/admin'
import { useStore } from '@/store'
import { formatTime } from '@/utils'

const store = useStore()
const toast = useToast()

const dashboardData = ref<{
  userCount: number
  postCount: number
  commentCount: number
  latestUser: {
    uid: number
    name: string
    nickname: string
    createdAt: string
  }
}>()

onMounted(() => {
  fetchData()
})

function fetchData() {
  NProgress.start()
  getDashboardData(store.token)
    .then((res: any) => {
      dashboardData.value = res
    })
    .catch((err: any) => {
      toast.error(err.message)
    })
    .finally(() => {
      NProgress.done()
    })
}
</script>
