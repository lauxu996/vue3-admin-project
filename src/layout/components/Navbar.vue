<template>
  <div class="navbar">
    <div class="left-menu">
      <el-icon class="hamburger" @click="toggleSidebar">
        <Expand v-if="sidebar.opened" />
        <Fold v-else />
      </el-icon>

      <breadcrumb class="breadcrumb-container" />
    </div>

    <div class="right-menu">
      <el-dropdown trigger="click" @command="handleCommand">
        <div class="avatar-container">
          <el-avatar :size="32" :src="userStore.avatar">
            {{ userStore.nickname.charAt(0) }}
          </el-avatar>
          <span class="username">{{ userStore.nickname }}</span>
          <el-icon class="el-icon--right">
            <CaretBottom />
          </el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">个人中心</el-dropdown-item>
            <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { useAppStore } from '@/store/modules/app'
import { useUserStore } from '@/store/modules/user'
import Breadcrumb from './Breadcrumb.vue'

const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()

const sidebar = computed(() => appStore.sidebar)

const toggleSidebar = () => {
  appStore.toggleSidebar()
}

const handleCommand = (command: string) => {
  if (command === 'logout') {
    ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      userStore.logout()
      router.push('/login')
    })
  } else if (command === 'profile') {
    // 跳转到个人中心
  }
}
</script>

<style scoped lang="scss">
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;

  .left-menu {
    display: flex;
    align-items: center;
    gap: 20px;

    .hamburger {
      font-size: 24px;
      cursor: pointer;
      color: #5a5e66;

      &:hover {
        color: #409eff;
      }
    }

    .breadcrumb-container {
      flex: 1;
    }
  }

  .right-menu {
    display: flex;
    align-items: center;
    gap: 20px;

    .avatar-container {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;

      .username {
        font-size: 14px;
        color: #333;
      }

      &:hover {
        .username {
          color: #409eff;
        }
      }
    }
  }
}
</style>
