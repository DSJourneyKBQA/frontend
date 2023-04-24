import request from '@/utils/request'

export function getDashboardData(token: string): any {
  return request({
    url: '/admin/getDashboardData',
    method: 'post',
    data: {
      token,
    },
  })
}

export function getUserList(token: string, page = 1): any {
  return request({
    url: '/admin/getUserList',
    method: 'post',
    data: {
      token,
      page,
    },
  })
}

export function deleteUser(token: string, uid: number): any {
  return request({
    url: '/admin/deleteUser',
    method: 'post',
    data: {
      token,
      uid,
    },
  })
}

export function banUser(token: string, uid: number): any {
  return request({
    url: '/admin/banUser',
    method: 'post',
    data: {
      token,
      uid,
    },
  })
}

export function unbanUser(token: string, uid: number): any {
  return request({
    url: '/admin/unbanUser',
    method: 'post',
    data: {
      token,
      uid,
    },
  })
}

export function getPostList(token: string, page = 1, uid = 0): any {
  return request({
    url: '/admin/getPostList',
    method: 'post',
    data: {
      token,
      page,
      uid,
    },
  })
}

export function deletePost(token: string, pid: number): any {
  return request({
    url: '/admin/deletePost',
    method: 'post',
    data: {
      token,
      pid,
    },
  })
}

export function allowPostComment(token: string, pid: number): any {
  return request({
    url: '/admin/allowPostComment',
    method: 'post',
    data: {
      token,
      pid,
    },
  })
}

export function prohibitPostComment(token: string, pid: number): any {
  return request({
    url: '/admin/prohibitPostComment',
    method: 'post',
    data: {
      token,
      pid,
    },
  })
}

export function getCommentList(token: string, page = 1): any {
  return request({
    url: '/admin/getCommentList',
    method: 'post',
    data: {
      token,
      page,
    },
  })
}

export function deleteComment(token: string, cid: number): any {
  return request({
    url: '/admin/deleteComment',
    method: 'post',
    data: {
      token,
      cid,
    },
  })
}

export function banComment(token: string, cid: number): any {
  return request({
    url: '/admin/banComment',
    method: 'post',
    data: {
      token,
      cid,
    },
  })
}

export function approveComment(token: string, cid: number): any {
  return request({
    url: '/admin/approveComment',
    method: 'post',
    data: {
      token,
      cid,
    },
  })
}
