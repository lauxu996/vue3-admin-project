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
  token: string
  userInfo: UserInfo
}
