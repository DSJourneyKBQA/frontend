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

export function getChapterContent(id: number): any {
  return request({
    url: '/study/getChapterContent',
    method: 'get',
    params: {
      id,
    },
  })
}

export function submitTest(token: string, questionId: number, content: string): any {
  return request({
    url: '/study/submitTest',
    method: 'post',
    data: {
      token,
      questionId,
      content,
    },
  })
}

export async function completeChapter(token: string, chapterId: number): Promise<any> {
  return request({
    url: '/study/completeChapter',
    method: 'post',
    data: {
      token,
      cid: chapterId,
    },
  })
}
