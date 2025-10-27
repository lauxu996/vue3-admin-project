/**
 * 认证相关 API
 */
import { request } from '@/utils/request'
import type { LoginParams, LoginResult, UserInfo, RefreshTokenResult } from '@/types/user'
import type { ApiResponse } from '@/types/api'

/**
 * 登录
 */
export function login(data: LoginParams): Promise<ApiResponse<LoginResult>> {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

/**
 * 登出
 */
export function logout(): Promise<ApiResponse<void>> {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}

/**
 * 获取用户信息
 */
export function getUserInfo(): Promise<ApiResponse<UserInfo>> {
  return request({
    url: '/auth/userInfo',
    method: 'get'
  })
}

/**
 * 刷新 Token
 */
export function refreshToken(refreshToken: string): Promise<ApiResponse<RefreshTokenResult>> {
  return request({
    url: '/auth/refreshToken',
    method: 'post',
    data: { refreshToken }
  })
}
