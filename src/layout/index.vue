<template>
  <div class="app-wrapper" :class="{ 'mobile': device === 'mobile' }">
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
</script>

<style scoped lang="scss">
.app-wrapper {
  position: relative;
  width: 100%;
  height: 100%;

  &.mobile {
    .sidebar-container {
      width: 0;
    }

    .main-container {
      margin-left: 0;
    }
  }
}

.sidebar-container {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 210px;
  background: #304156;
  transition: width 0.28s;
  z-index: 1001;
}

.main-container {
  min-height: 100vh;
  margin-left: 210px;
  transition: margin-left 0.28s;
  position: relative;
}
</style>
