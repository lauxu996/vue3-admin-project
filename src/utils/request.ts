/**
 * axios 封装
 */
import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'
import { getToken } from './storage'
import type { ApiResponse } from '@/types/api'

// 创建 axios 实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 添加 token
    const token = getToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('请求错误：', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>): any => {
    const { data, config } = response

    // 如果是下载文件，直接返回
    if (config.responseType === 'blob') {
      return response
    }

    const { code, msg } = data

    // 根据业务状态码判断
    if (code === 0 || code === 200) {
      return data
    }

    // token 过期
    if (code === 401) {
      ElMessage.error('登录已过期，请重新登录')
      // 跳转到登录页
      window.location.href = '/login'
      return Promise.reject(new Error(msg || '登录已过期'))
    }

    // 其他错误
    ElMessage.error(msg || '请求失败')
    return Promise.reject(new Error(msg || '请求失败'))
  },
  (error) => {
    // 处理 HTTP 错误
    let message = '请求失败'
    if (error.response) {
      const { status } = error.response
      switch (status) {
        case 400:
          message = '请求参数错误'
          break
        case 401:
          message = '未授权，请重新登录'
          window.location.href = '/login'
          break
        case 403:
          message = '拒绝访问'
          break
        case 404:
          message = '请求地址不存在'
          break
        case 500:
          message = '服务器错误'
          break
        default:
          message = `连接错误 ${status}`
      }
    } else if (error.message) {
      if (error.message.includes('timeout')) {
        message = '请求超时'
      } else if (error.message.includes('Network Error')) {
        message = '网络连接错误'
      }
    }

    ElMessage.error(message)
    return Promise.reject(error)
  }
)

// 导出封装的请求方法
export const request = <T = any>(config: AxiosRequestConfig): Promise<T> => {
  return service.request(config)
}

export default service
