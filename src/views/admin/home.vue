<!-- eslint-disable no-console -->
<template>
  <div>
    <p class="mb-4 text-2xl font-bold">
      个人资料
    </p>
    <div class="my-2">
      <h3>修改昵称</h3>
      <input
        v-model="newNickname" class="px-2 py-1 w-[300px] rounded-md border hover:border-blue-500 transition-colors"
        type="text"
      >
    </div>
    <div class="my-2">
      <h3>修改密码</h3>
      <input
        v-model="newPassword" class="px-2 py-1 w-[300px] rounded-md border hover:border-blue-500 transition-colors"
        type="password" placeholder="留空则不修改"
      >
    </div>
    <div class="my-2">
      <h3>修改头像</h3>
      <p>修改图片地址或选择图片上传，图片最大为 5M</p>
      <p>建议上传方形图片，防止图片被拉伸影响显示效果</p>
      <img class="w-16 h-16 my-2" :src="newAvatar" alt="user-avatar">
      <input
        v-model="newAvatar" class="px-2 py-1 w-[300px] rounded-md border hover:border-blue-500 transition-colors"
        type="text" placeholder="留空则不修改"
      >
      <CommonButton @click="handleUploadImage">
        选择图片上传
      </CommonButton>
    </div>
    <CommonButton primary @click="handleEditProfile">
      保存修改
    </CommonButton>
  </div>
</template>

<script setup lang="ts">
import NProgress from 'nprogress'
import { computed, onMounted, ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useStore } from '@/store'
import { edit, getImageUploadToken, getInfo } from '@/api/user'
import type { UserProfile } from '@/types'
import { imageUploadApiURL } from '@/config'

const store = useStore()
const toast = useToast()

const rePassword = /^(?=.*?[a-zA-Z])(?=.*?[0-9]).{6,30}$/
const userProfile = ref<UserProfile>()

const newNickname = ref('加载中')
const newPassword = ref('')
const newAvatar = ref('加载中')

const vaildNickname = computed(() => (newNickname.value.length >= 2 && newNickname.value.length <= 20) || newNickname.value === '')
const vaildPassword = computed(() => rePassword.test(newPassword.value) || newPassword.value === '')

onMounted(() => {
  fetchData()
})

function fetchData() {
  NProgress.start()
  getInfo(store.uid)
    .then((result: any) => {
      userProfile.value = result.userInfo as UserProfile
      newNickname.value = userProfile.value.nickname
      newAvatar.value = userProfile.value.avatar
    })
    .catch((err: any) => {
      toast.error(err.message)
    })
    .finally(() => {
      NProgress.done()
    })
}

function handleUploadImage() {
  const uploader = document.createElement('input')
  uploader.type = 'file'
  uploader.accept = 'image/gif, image/jpeg, image/png, image/jpg'
  uploader.style.display = 'none'
  document.body.appendChild(uploader)
  uploader.addEventListener('change', () => {
    if (!uploader.files || uploader.files.length === 0) {
      toast.warning('上传取消，未选择图片')
      uploader.remove()
      return
    }
    const file = uploader.files[0]
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      toast.warning('上传取消，图片不是允许的格式')
      return
    }
    if (file.size >= 5 * 1024 * 1024) {
      toast.warning('上传取消，文件大小超出限制')
      uploader.remove()
      return
    }
    getImageUploadToken(store.token)
      .then((res: any) => {
        const token = res.token
        const formData = new FormData()
        formData.append('file', file)
        fetch(imageUploadApiURL, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }).then(res => res.json())
          .then((json) => {
            if (json.status) {
              toast.success('上传成功，点击保存即可替换头像')
              // eslint-disable-next-line no-console
              console.debug(`[image-uploader] image upload success, url:${json.data.links.url}`)
              newAvatar.value = json.data.links.url
            }
            else {
              toast.error('上传失败，图片服务器错误')
            }
          })
          .catch((err) => {
            toast.error('上传失败，图片服务器错误')
          })
          .finally(() => {
            uploader.remove()
          })
      })
      .catch((err: any) => {
        toast.error('上传失败，服务器错误')
      })
  })
  uploader.click()
}

function handleEditProfile() {
  if (newNickname.value.trim() === '') {
    toast.warning('新昵称不可为空')
    return
  }
  if (!vaildNickname.value) {
    toast.warning('昵称格式错误')
    return
  }
  if (!vaildPassword.value) {
    toast.warning('密码格式错误')
    return
  }
  edit(store.token, newNickname.value.trim(), newPassword.value.trim(), newAvatar.value.trim())
    .then((result: any) => {
      userProfile.value = result.userInfo
      newPassword.value = ''
      toast.success('保存成功')
    })
    .catch((err: any) => {
      toast.error(`保存失败${err}`)
    })
}
</script>
