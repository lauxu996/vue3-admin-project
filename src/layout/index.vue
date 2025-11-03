<template>
  <div class="app-wrapper" :class="classObj">
    <!-- 侧边栏 -->
    <Sidebar class="sidebar-container" />

    <!-- 主内容区 -->
    <div class="main-container">
      <!-- 顶部导航栏 -->
      <Navbar />

      <!-- 标签页导航 -->
      <TagsView />

      <!-- 主要内容 -->
      <AppMain />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/store/modules/app'
import Sidebar from './components/Sidebar/index.vue'
import Navbar from './components/Navbar.vue'
import TagsView from './components/TagsView.vue'
import AppMain from './components/AppMain.vue'

const appStore = useAppStore()
const device = computed(() => appStore.device)
const sidebar = computed(() => appStore.sidebar)

const classObj = computed(() => ({
  mobile: device.value === 'mobile',
  hideSidebar: !sidebar.value.opened,
  openSidebar: sidebar.value.opened,
  withoutAnimation: sidebar.value.withoutAnimation
}))
</script>

<style scoped lang="scss">
.app-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: var(--bg-color);
  transition: background-color 0.3s;

  &.mobile {
    .sidebar-container {
      width: 0 !important;
    }

    .main-container {
      margin-left: 0 !important;
    }
  }

  // 侧边栏折叠状态
  &.hideSidebar {
    .sidebar-container {
      width: 54px;
    }

    .main-container {
      margin-left: 54px;
    }
  }

  // 侧边栏展开状态
  &.openSidebar {
    .sidebar-container {
      width: 210px;
    }

    .main-container {
      margin-left: 210px;
    }
  }

  // 禁用动画
  &.withoutAnimation {
    .sidebar-container,
    .main-container {
      transition: none !important;
    }
    
    .logo-container h1 {
      transition: none !important;
    }
  }
}

.sidebar-container {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 210px;
  background: var(--sidebar-bg);
  transition: width 0.2s ease-in-out, background-color 0.3s; // 减少动画时间到 0.2s
  z-index: 1001;
  overflow: hidden;
  will-change: width; // GPU 加速
}

.main-container {
  min-height: 100vh;
  margin-left: 210px;
  transition: margin-left 0.2s ease-in-out; // 减少动画时间到 0.2s
  position: relative;
  will-change: margin-left; // GPU 加速
}
</style>
