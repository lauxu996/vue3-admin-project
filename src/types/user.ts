/**
 * 用户相关类型定义
 */

// 用户信息
export interface UserInfo {
  id: string | number
  username: string
  nickname: string
  avatar?: string
  email?: string
  phone?: string
  roles: string[]
  permissions: string[]
}

// 登录请求参数
export interface LoginParams {
  username: string
  password: string
  captcha?: string
}

// 登录响应数据
export interface LoginResult {
  accessToken: string
  refreshToken: string
  expiresIn?: number // token 过期时间（秒）
  userInfo: UserInfo
}

// Token 刷新响应数据
export interface RefreshTokenResult {
  accessToken: string
  refreshToken: string
  expiresIn?: number
}
