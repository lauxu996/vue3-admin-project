/**
 * 本地存储工具
 */

const TOKEN_KEY = 'ACCESS_TOKEN'
const USER_INFO_KEY = 'USER_INFO'

// Token 管理
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY)
}

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token)
}

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY)
}

// 用户信息管理
export const getUserInfo = (): any => {
  const userInfo = localStorage.getItem(USER_INFO_KEY)
  return userInfo ? JSON.parse(userInfo) : null
}

export const setUserInfo = (userInfo: any): void => {
  localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo))
}

export const removeUserInfo = (): void => {
  localStorage.removeItem(USER_INFO_KEY)
}

// 清除所有登录信息
export const clearAuth = (): void => {
  removeToken()
  removeUserInfo()
}
