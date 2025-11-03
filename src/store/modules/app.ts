/**
 * 应用状态管理
 */
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useAppStore = defineStore('app', () => {
  // 侧边栏状态
  const sidebar = ref({
    opened: true,
    withoutAnimation: false
  })

  // 设备类型
  const device = ref<'desktop' | 'mobile'>('desktop')

  // 主题模式 ('light' | 'dark')
  const theme = ref<'light' | 'dark'>(
    (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
  )

  // 切换侧边栏
  const toggleSidebar = (withoutAnimation = false) => {
    sidebar.value.opened = !sidebar.value.opened
    sidebar.value.withoutAnimation = withoutAnimation
  }

  // 关闭侧边栏
  const closeSidebar = (withoutAnimation = false) => {
    sidebar.value.opened = false
    sidebar.value.withoutAnimation = withoutAnimation
  }

  // 打开侧边栏
  const openSidebar = (withoutAnimation = false) => {
    sidebar.value.opened = true
    sidebar.value.withoutAnimation = withoutAnimation
  }

  // 设置设备类型
  const setDevice = (val: 'desktop' | 'mobile') => {
    device.value = val
  }

  // 切换主题
  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  // 设置主题
  const setTheme = (val: 'light' | 'dark') => {
    theme.value = val
  }

  // 监听主题变化，应用到 document
  watch(
    theme,
    (newTheme) => {
      document.documentElement.setAttribute('data-theme', newTheme)
      localStorage.setItem('theme', newTheme)
    },
    { immediate: true }
  )

  return {
    sidebar,
    device,
    theme,
    toggleSidebar,
    closeSidebar,
    openSidebar,
    setDevice,
    toggleTheme,
    setTheme
  }
})
