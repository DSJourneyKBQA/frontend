import axios from 'axios'
import { baseURL } from '@/constants/config'

const instance = axios.create({
  baseURL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
})

instance.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res.code === 0) {
      return res.data
    }
    else {
      console.error(res.msg)
      return Promise.reject(new Error(res.msg))
    }
  },
  (error) => {
    console.error('服务器或网络错误', error)
    return Promise.reject(error)
  },
)

export default instance
