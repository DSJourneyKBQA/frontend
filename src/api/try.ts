import request from '@/utils/request'

export function getChapterList(token: string, uid: number): any {
  return request({
    url: '/study/getChapterList',
    method: 'post',
    data: {
      token,
      uid,
    },
  })
}
