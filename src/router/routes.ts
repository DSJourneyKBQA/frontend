import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  // 重定向
  {
    path: '/',
    redirect: '/home',
  },
  // 路由项
  {
    path: '/admin',
    component: () => import('@/views/admin.vue'),
    children: [
      {
        path: 'home',
        name: 'admin-home',
        component: () => import('@/views/admin/home.vue'),
        meta: {
          title: '个人资料 - 管理后台',
          requireLogin: true,
        },
      },
      {
        path: 'post-new',
        name: 'post-new',
        component: () => import('@/views/admin/post-new.vue'),
        meta: {
          title: '发布文章 - 管理后台',
          requireLogin: true,
        },
      },
      {
        path: 'mypost',
        name: 'mypost',
        component: () => import('@/views/admin/mypost.vue'),
        meta: {
          title: '我的文章 - 管理后台',
          requireLogin: true,
        },
      },
      {
        path: 'user-setting',
        name: 'user-setting',
        component: () => import('@/views/admin/user-setting.vue'),
        meta: {
          title: '用户设置 - 管理后台',
          requireLogin: true,
        },
      },
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/admin/dashboard.vue'),
        meta: {
          title: '仪表盘 - 管理后台',
          requireAdmin: true,
        },
      },
      {
        path: 'user-manage',
        name: 'user-manage',
        component: () => import('@/views/admin/user-manage.vue'),
        meta: {
          title: '用户管理 - 管理后台',
          requireAdmin: true,
        },
      },
      {
        path: 'post-manage',
        name: 'post-manage',
        component: () => import('@/views/admin/post-manage.vue'),
        meta: {
          title: '文章管理 - 管理后台',
          requireAdmin: true,
        },
      },
      {
        path: 'comment-manage',
        name: 'comment-manage',
        component: () => import('@/views/admin/comment-manage.vue'),
        meta: {
          title: '评论管理 - 管理后台',
          requireAdmin: true,
        },
      },
      {
        path: 'system-setting',
        name: 'system-setting',
        component: () => import('@/views/admin/system-setting.vue'),
        meta: {
          title: '系统设置 - 管理后台',
          requireAdmin: true,
        },
      },
      {
        path: 'about',
        name: 'about',
        component: () => import('@/views/admin/about.vue'),
        meta: {
          title: '关于',
        },
      }],
  },
  {
    path: '/',
    component: () => import('@/views/public.vue'),
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('@/views/public/home.vue'),

      },
      {
        path: 'study',
        name: 'study',
        component: () => import('@/views/public/study.vue'),
        meta: {
          requireLogin: true,
        },
      },
      {
        path: 'experience',
        name: 'experience',
        component: () => import('@/views/public/experience.vue'),
        meta: {
          requireLogin: true,
        },
      },
      {
        path: 'blog',
        name: 'blog-home',
        component: () => import('@/views/public/blog/home.vue'),
      },
      {
        path: 'blog/post/:pid',
        name: 'blog-post',
        component: () => import('@/views/public/blog/post.vue'),
      },
      {
        path: 'user',
        name: 'user-profile',
        component: () => import('@/views/public/user.vue'),
        meta: {
          requireLogin: true,
        },
      },
      {
        path: 'user/:id',
        name: 'user',
        component: () => import('@/views/public/user.vue'),
      },
      {
        path: 'login',
        name: 'login',
        component: () => import('@/views/public/login.vue'),
      },
    ],
  },

]

export default routes
