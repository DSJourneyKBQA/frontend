import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  // 重定向
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/admin',
    redirect: '/admin/home',
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
        path: 'chapter-manage',
        name: 'chapter-manage',
        component: () => import('@/views/admin/chapter-manage.vue'),
        meta: {
          title: '学习章节管理 - 管理后台',
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
    component: () => import('@/views/user.vue'),
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('@/views/user/home.vue'),
        meta: {
          title: '首页',
        },
      },
      {
        path: 'roadmap',
        name: 'roadmap',
        component: () => import('@/views/user/roadmap.vue'),
        meta: {
          title: '学习路线图',
        },
      },
      {
        path: 'study',
        name: 'study',
        component: () => import('@/views/user/study.vue'),
        meta: {
          title: '学习',
          requireLogin: true,
        },
      },
      {
        path: 'try',
        name: 'try',
        component: () => import('@/views/user/try.vue'),
        meta: {
          title: '体验',
          requireLogin: true,
        },
      },
      {
        path: 'blog',
        name: 'blog-home',
        component: () => import('@/views/user/blog/home.vue'),
      },
      {
        path: 'blog/post/:pid',
        name: 'blog-post',
        component: () => import('@/views/user/blog/post.vue'),
      },
      {
        path: 'user',
        name: 'user-profile',
        component: () => import('@/views/user/user.vue'),
        meta: {
          requireLogin: true,
        },
      },
      {
        path: 'user/:uid',
        name: 'user',
        component: () => import('@/views/user/user.vue'),
      },
      {
        path: 'login',
        name: 'login',
        component: () => import('@/views/user/login.vue'),
      },
    ],
  },

]

export default routes
