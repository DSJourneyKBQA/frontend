import type { ItemType } from '@/enums'

export interface PostData {
  pid: number
  title: string
  text: string
  like: number
  viewCount: number
  allowComment: number
  createdAt: string
  user: UserData
  _count: {
    comments: number
  }
}

export interface PostDetailData {
  pid: number
  title: string
  text: string
  author: number
  publish: boolean
  like: number
  password: null
  viewCount: number
  allowComment: number
  createdAt: string
  updatedAt: string
  user: UserData
}

export interface CommentData {
  cid: number
  text: string
  replyTo: number | null
  like: number
  dislike: number
  createdAt: string
  user: UserData
}

export interface UserData {
  uid: number
  nickname: string
  avatar: string
}

export interface UserProfile {
  uid: number
  name: string
  nickname: string
  sex: string
  status: number
  role: string
  avatar: string
}

export interface NewPostData {
  title: string
  content: string
}

export interface ChapterData {
  id: number
  name: string
  status: boolean
  children: any[]
}

export interface ChapterContentData {
  cid: number
  title: string
  description: string
  content: string
  status: boolean
  tests: string
}

export interface AdminUserData {
  uid: number
  name: string
  email: string
  nickname: string
  sex: string
  status: number
  role: string
  avatar: string
  createdAt: string
  loggedAt: string
  _count: {
    posts: number
    comments: number
  }
}

export interface AdminPostData {
  pid: number
  title: string
  text: string
  like: number
  viewCount: number
  allowComment: number
  createdAt: string
  updatedAt: string
  user: {
    uid: number
    name: string
    nickname: string
  }
  _count: {
    comments: number
  }
}

export interface AdminCommentData {
  cid: number
  text: string
  ip: string
  agent: string
  replyTo: null | number
  status: number
  createdAt: string
  user: {
    uid: number
    name: string
    nickname: string
  }
  post: {
    pid: number
    title: string
  }
}

export interface CanvasItem {
  id: string
  type: ItemType
  title: string
  status: 0 | 1 | 2 | 3 | 4 // 0:未开启 1:正常 2:异常 3:收到心跳
  position: {
    x: number
    y: number
  }
  select: boolean
  address: string
  sid: number
  gid: number
}

export interface TestData {
  id: number
  template: string
}

export interface LogData {
  timestamp: string
  type: string
  raw: string
}
