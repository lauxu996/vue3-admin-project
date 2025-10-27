<template>
  <div class="sidebar">
    <div class="logo-container" :class="{ 'collapse': !sidebar.opened }">
      <h1 v-if="sidebar.opened">远程诊断平台</h1>
      <h1 v-else class="logo-text-collapse">远程</h1>
    </div>
    
    <el-scrollbar>
      <el-menu
        :default-active="activeMenu"
        :collapse="!sidebar.opened"
        :unique-opened="true"
        :collapse-transition="false"
        mode="vertical"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409eff"
        router
      >
        <sidebar-item
          v-for="route in permissionRoutes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/store/modules/app'
import { usePermissionStore } from '@/store/modules/permission'
import SidebarItem from './SidebarItem.vue'
import { constantRoutes } from '@/router/routes'

const route = useRoute()
const appStore = useAppStore()
const permissionStore = usePermissionStore()

const sidebar = computed(() => appStore.sidebar)

// 合并常驻路由和动态路由，过滤掉隐藏的路由
const permissionRoutes = computed(() => {
  // 过滤出需要在侧边栏显示的常驻路由
  const visibleConstantRoutes = constantRoutes.filter(route => {
    // 过滤掉 hidden 为 true 的路由
    return !route.meta?.hidden
  })
  
  // 合并常驻路由和动态路由
  return [...visibleConstantRoutes, ...permissionStore.routes]
})

const activeMenu = computed(() => {
  const { meta, path } = route
  if (meta?.activeMenu) {
    return meta.activeMenu
  }
  return path
})
</script>

<style scoped lang="scss">
.sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;

  .logo-container {
    height: 50px;
    line-height: 50px;
    background: #2b2f3a;
    text-align: center;
    overflow: hidden;

    h1 {
      color: #fff;
      font-weight: 600;
      font-size: 20px;
      margin: 0;
      white-space: nowrap;
      transition: opacity 0.2s ease-in-out;
    }

    &.collapse {
      h1 {
        opacity: 0.9;
      }
      
      .logo-text-collapse {
        font-size: 16px;
      }
    }
  }

  :deep(.el-scrollbar) {
    height: calc(100vh - 50px);
  }

  :deep(.el-menu) {
    border: none;
    background-color: #304156;
  }

  // 折叠后的菜单样式
  :deep(.el-menu--collapse) {
    width: 54px;

    .el-menu-item,
    .el-sub-menu__title {
      text-align: center;
      padding: 0 !important;
      justify-content: center;

      span {
        opacity: 0;
        transition: opacity 0.2s;
        height: 0;
        width: 0;
        overflow: hidden;
      }

      .el-sub-menu__icon-arrow {
        display: none;
      }

      .el-icon {
        margin: 0;
      }
    }

    .el-sub-menu {
      .el-menu {
        background-color: #1f2d3d;
      }
    }
  }
}
</style>
