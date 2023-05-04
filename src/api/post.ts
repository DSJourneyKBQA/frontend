import request from '@/utils/request'

export function getList(page = 1, uid: number | null = null): any {
  return request({
    url: '/post/getList',
    method: 'get',
    params: {
      page,
      uid,
    },
  })
}

export function getHotList() {
  return request({
    url: '/post/getHotList',
    method: 'get',
  })
}

export function getPost(pid: number): any {
  return request({
    url: '/post/getPost',
    method: 'get',
    params: {
      pid,
    },
  })
}

export function newPost(token: string, title: string, text: string) {
  return request({
    url: '/post/newPost',
    method: 'post',
    data: {
      token,
      title,
      text,
    },
  })
}

export function editPost(token: string, pid: number, title: string, text: string) {
  return request({
    url: '/post/editPost',
    method: 'post',
    data: {
      token,
      pid,
      title,
      text,
    },
  })
}

export function deletePost(token: string, pid: number) {
  return request({
    url: '/post/deletePost',
    method: 'post',
    data: {
      token,
      pid,
    },
  })
}

export function getComment(pid: number): any {
  return request({
    url: '/post/getComment',
    method: 'get',
    params: {
      pid,
    },
  })
}

export function newComment(token: string, pid: number, text: string, agent: string, replyTo: number | null = null) {
  return request({
    url: '/post/newComment',
    method: 'post',
    data: {
      token,
      pid,
      text,
      agent,
      replyTo,
    },
  })
}

export function submitLike(token: string, type: string, sid: number) {
  return request({
    url: '/post/submitLike',
    method: 'post',
    data: {
      token,
      type,
      sid,
    },
  })
}

export function cancelLike(token: string, type: string, sid: number) {
  return request({
    url: '/post/cancelLike',
    method: 'post',
    data: {
      token,
      type,
      sid,
    },
  })
}

export function getPostTitle(pids: string) {
  return request({
    url: '/post/getPostTitle',
    method: 'get',
    params: {
      pids,
    },
  })
}
