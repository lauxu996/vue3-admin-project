/**
 * 用户状态管理
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserInfo } from '@/types/user'
import { getUserInfo as getStorageUserInfo, setUserInfo as setStorageUserInfo, clearAuth } from '@/utils/storage'

export const useUserStore = defineStore('user', () => {
  // 状态
  const userInfo = ref<UserInfo | null>(getStorageUserInfo())
  const token = ref<string>('')

  // 计算属性
  const userId = computed(() => userInfo.value?.id || '')
  const username = computed(() => userInfo.value?.username || '')
  const nickname = computed(() => userInfo.value?.nickname || '')
  const avatar = computed(() => userInfo.value?.avatar || '')
  const roles = computed(() => userInfo.value?.roles || [])
  const permissions = computed(() => userInfo.value?.permissions || [])

  // 是否已登录
  const isLogin = computed(() => !!token.value && !!userInfo.value)

  // 设置用户信息
  const setUserInfo = (info: UserInfo) => {
    userInfo.value = info
    setStorageUserInfo(info)
  }

  // 设置 token
  const setToken = (newToken: string) => {
    token.value = newToken
  }

  // 登出
  const logout = () => {
    userInfo.value = null
    token.value = ''
    clearAuth()
  }

  // 重置
  const reset = () => {
    logout()
  }

  return {
    // 状态
    userInfo,
    token,
    // 计算属性
    userId,
    username,
    nickname,
    avatar,
    roles,
    permissions,
    isLogin,
    // 方法
    setUserInfo,
    setToken,
    logout,
    reset
  }
})
