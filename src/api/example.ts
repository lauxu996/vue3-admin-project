/**
 * 示例 API - 演示 Token 刷新机制
 */
import { request } from '@/utils/request'
import type { ApiResponse } from '@/types/api'

/**
 * 获取用户列表示例
 * 当 token 过期时，会自动刷新 token 并重试请求
 */
export function getUserList(): Promise<ApiResponse<any[]>> {
  return request({
    url: '/user/list',
    method: 'get'
  })
}

/**
 * 创建用户示例
 */
export function createUser(data: any): Promise<ApiResponse<void>> {
  return request({
    url: '/user/create',
    method: 'post',
    data
  })
}
