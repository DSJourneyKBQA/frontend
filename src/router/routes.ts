import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [

  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/study',
    name: 'study',
    component: () => import('@/views/Study.vue'),
  },
  {
    path: '/experience',
    name: 'experience',
    component: () => import('@/views/Experience.vue'),
  },
  {
    path: '/blog',
    name: 'blog',
    component: () => import('@/views/Blog.vue'),
  },
  {
    path: '/user',
    name: 'user',
    component: () => import('@/views/User.vue'),
  },
]

export default routes
