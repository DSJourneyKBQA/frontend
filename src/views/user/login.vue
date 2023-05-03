<template>
  <div class="w-full">
    <div class="w-full md:w-[400px] bg-gh-card border border-github mt-4 mx-auto px-8 pt-2 pb-6 rounded-[10px] overflow-hidden shadow-sm">
      <template v-if="!isRegister">
        <h1 class="text-center">
          用户登录
        </h1>
        <div class="border border-github rounded-md mt-10">
          <div class="flex items-center pl-3 border-b border-github">
            <span class="w-[50px]">用户名</span>
            <input
              v-model="loginParams.username" v-focus class="flex-1 h-[40px] px-3 outline-none bg-gh-card" type="text"
              placeholder="请输入用户名" maxlength="12"
            >
          </div>
          <div class="flex items-center pl-3">
            <span class="w-[50px]">密码</span>
            <input
              v-model="loginParams.password" class="flex-1 h-[40px] px-3 outline-none bg-gh-card" type="password" placeholder="请输入密码"
              maxlength="36" @keydown.enter="handleLogin"
            >
          </div>
        </div>
        <div class="flex flex-col justify-center mt-10">
          <CommonButton primary dark @click="handleLogin">
            登录
          </CommonButton>
          <CommonButton dark class="mt-2" @click="isRegister = true">
            前往注册
          </CommonButton>
        </div>
      </template>
      <template v-else>
        <h1 class="text-center">
          用户注册
        </h1>
        <div class="border border-github rounded-md mt-10">
          <div class="px-3 border-b border-github">
            <div class="flex items-center">
              <span class="w-[50px] shrink-0">用户名</span>
              <input
                v-model="registerParams.username" class="flex-1 h-[40px] px-3 outline-none bg-gh-card" type="text"
                placeholder="请输入用户名"
              >
            </div>
            <div v-show="!vaildUsername" class="text-center text-red-500 pb-1">
              用户名由小写字母、数字、下划线组成，长度5-12字符
            </div>
          </div>
          <div class="px-3 border-b border-github">
            <div class="flex items-center">
              <span class="w-[50px] shrink-0">昵称</span>
              <input
                v-model="registerParams.nickname" class="flex-1 h-[40px] px-3 outline-none bg-gh-card" type="text"
                placeholder="请输入昵称"
              >
            </div>
            <div v-show="!vaildNickname" class="text-center text-red-500 pb-1">
              昵称长度2-20字符
            </div>
          </div>
          <div class="px-3 border-b border-github">
            <div class="flex items-center">
              <span class="w-[50px] shrink-0">邮箱</span>
              <input
                v-model="registerParams.email" class="flex-1 h-[40px] px-3 outline-none bg-gh-card" type="email"
                placeholder="请输入邮箱"
              >
            </div>
            <div v-show="!vaildEmail" class="text-center text-red-500 pb-1">
              邮箱格式不正确
            </div>
          </div>
          <div class="px-3 border-b border-github">
            <div class="flex items-center">
              <span class="w-[50px] shrink-0">密码</span>
              <input
                v-model="registerParams.password" class="flex-1 h-[40px] px-3 outline-none bg-gh-card" type="password"
                placeholder="请输入密码"
              >
            </div>
            <div v-show="!vaildPassword" class="text-center text-red-500 pb-1">
              密码需要包含 [大写或小写字母] 和 [数字] ，长度6-30字符
            </div>
          </div>
        </div>
        <div class="pl-3 mt-2">
          <span>性别</span>
          <label for="sex_male" class="ml-2"><input
            id="sex_male" v-model="registerParams.sex" type="radio" name="sex"
            value="MALE"
          >
            男</label>
          <label for="sex_female" class="ml-2"><input
            id="sex_female" v-model="registerParams.sex" type="radio" name="sex"
            value="FEMALE"
          >
            女</label>
          <label for="sex_secret" class="ml-2"><input
            id="sex_secret" v-model="registerParams.sex" type="radio" name="sex"
            value="SECRET"
          >
            保密</label>
        </div>
        <div class="flex flex-col justify-center mt-10">
          <CommonButton primary dark @click="handleRegister">
            注册
          </CommonButton>
          <CommonButton dark class="mt-2" @click="isRegister = false">
            返回登录
          </CommonButton>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useToast } from 'vue-toastification'
import { login, register } from '@/api/user'
import router from '@/router'
import { useStore } from '@/store'

const vFocus = {
  mounted: (el: HTMLElement) => el.focus(),
}

const store = useStore()
const toast = useToast()

const reUserId = /^[a-z0-9-_]{5,12}$/
const rePassword = /^(?=.*?[a-zA-Z])(?=.*?[0-9]).{6,30}$/
const reEmail = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/
const isRegister = ref(false)
const loginParams = ref({
  username: '',
  password: '',
})
const registerParams = ref({
  username: '',
  nickname: '',
  password: '',
  email: '',
  sex: 'MALE',
})

const vaildUsername = computed(() => reUserId.test(registerParams.value.username) || registerParams.value.username === '')
const vaildNickname = computed(() => registerParams.value.nickname.length >= 2 && (registerParams.value.nickname.length <= 20 || registerParams.value.nickname === ''))
const vaildPassword = computed(() => rePassword.test(registerParams.value.password) || registerParams.value.password === '')
const vaildEmail = computed(() => reEmail.test(registerParams.value.email) || registerParams.value.email === '')

async function handleLogin() {
  if (loginParams.value.username.trim() === '') {
    toast.warning('用户名不可为空')
    return
  }
  if (loginParams.value.password.trim() === '') {
    toast.warning('密码不可为空')
    return
  }
  login(loginParams.value.username.trim(), loginParams.value.password.trim())
    .then((res: any) => {
      toast.success('登录成功')
      store.login = true
      store.uid = res.id
      store.token = res.token
      if (res.role === 'ADMIN')
        store.isAdmin = true

      // store.likeCache = { "POST": [], "COMMENT": [] }
      localStorage.setItem('uid', res.id)
      localStorage.setItem('token', res.token)
      router.push('/user')
    })
    .catch((err: any) => {
      toast.error(`登录失败：${err}`)
    })
}
async function handleRegister() {
  if (registerParams.value.username.trim() === '') {
    toast.warning('用户名不可为空')
    return
  }
  if (registerParams.value.nickname.trim() === '') {
    toast.warning('昵称不可为空')
    return
  }
  if (registerParams.value.email.trim() === '') {
    toast.warning('邮箱不可为空')
    return
  }
  if (registerParams.value.password.trim() === '') {
    toast.warning('密码不可为空')
    return
  }
  if (!vaildUsername.value) {
    toast.warning('用户名格式错误')
    return
  }
  if (!vaildNickname.value) {
    toast.warning('昵称格式错误')
    return
  }
  if (!vaildEmail.value) {
    toast.warning('邮箱格式错误')
    return
  }
  if (!vaildPassword.value) {
    toast.warning('密码格式错误')
    return
  }
  register(registerParams.value.username.trim(), registerParams.value.nickname.trim(), registerParams.value.password.trim(), registerParams.value.email.trim(), registerParams.value.sex)
    .then((res) => {
      toast.success('注册成功')
      isRegister.value = false
    })
    .catch((err) => {
      toast.error(`注册失败：${err}`)
    })
}
</script>
