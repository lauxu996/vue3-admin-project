/**
 * 应用状态管理
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  // 侧边栏状态
  const sidebar = ref({
    opened: true,
    withoutAnimation: false
  })

  // 设备类型
  const device = ref<'desktop' | 'mobile'>('desktop')

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

  return {
    sidebar,
    device,
    toggleSidebar,
    closeSidebar,
    openSidebar,
    setDevice
  }
})
