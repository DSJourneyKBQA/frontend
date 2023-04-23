<template>
  <div>
    <p class="mb-4 text-2xl font-bold">
      仪表盘
    </p>
    <div v-if="dashboardData">
      <p>用户总数：{{ dashboardData.userCount }}</p>
      <p>文章总数：{{ dashboardData.postCount }}</p>
      <p>评论总数：{{ dashboardData.commentCount }}</p>
      <p>
        最新注册用户：{{ dashboardData.latestUser.nickname }}({{ dashboardData.latestUser.name }})，uid: {{
          dashboardData.latestUser.uid
        }}，注册时间：{{ formatTime(dashboardData.latestUser.createdAt) }}
      </p>
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
