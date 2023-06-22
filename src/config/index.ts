import { ItemType } from '@/enums'

export const baseURL = '/api'
// export const baseURL = 'http://localhost:3000'

export const imageUploadApiURL = 'https://img.amarea.cn/api/v1/upload'

export const qaBaseURL = 'https://qa-server.amarea.cn'
// export const qaBaseURL = 'http://localhost:3001'

export const frontendRepo = 'https://github.com/DSJourneyKBQA/frontend'
export const backendRepo = 'https://github.com/DSJourneyKBQA/web-server'

export const pageSize = 10

export const bucketSize = 15

export const adminSideBarItem = {
  user: [
    {
      name: 'admin-home',
      to: '/home',
      display: '个人资料',
    },
    {
      name: 'post-new',
      to: '/post-new',
      display: '发布文章',
    },
    {
      name: 'mypost',
      to: '/mypost',
      display: '我的文章',
    },
    {
      name: 'user-setting',
      to: '/user-setting',
      display: '用户设置',
    },
  ],
  admin: [
    {
      name: 'dashboard',
      to: '/dashboard',
      display: '仪表盘',
    },
    {
      name: 'chapter-manage',
      to: '/chapter-manage',
      display: '学习章节管理',
    },
    {
      name: 'user-manage',
      to: '/user-manage',
      display: '用户管理',
    },
    {
      name: 'post-manage',
      to: '/post-manage',
      display: '文章管理',
    },
    {
      name: 'comment-manage',
      to: '/comment-manage',
      display: '评论管理',
    },
    // {
    //   name: 'system-setting',
    //   to: '/system-setting',
    //   display: '系统设置',
    // },
  ],
  public: [
    {
      name: 'about',
      to: '/about',
      display: '关于',
    },
    {
      name: 'APP_HOME',
      to: 'APP_HOME',
      display: '主页',
    },
  ],

}

export const itemTypeList = [
  { label: '网关服务器', value: ItemType.GatewayServer },
  { label: '配置服务器', value: ItemType.ConfigServer },
  { label: '存储服务器', value: ItemType.StorageServer },
  { label: '客户端', value: ItemType.Client },
]
