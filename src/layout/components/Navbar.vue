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
      <!-- 主题颜色选择器 -->
      <ThemeColorPicker />

      <!-- 主题切换按钮 -->
      <el-tooltip
        :content="theme === 'light' ? '切换到深色模式' : '切换到浅色模式'"
        placement="bottom"
      >
        <el-icon class="theme-toggle" @click="toggleTheme">
          <Sunny v-if="theme === 'light'" />
          <Moon v-else />
        </el-icon>
      </el-tooltip>

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
            <el-dropdown-item divided command="logout"
              >退出登录</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { ElMessageBox } from "element-plus";
import { Sunny, Moon } from "@element-plus/icons-vue";
import { useAppStore } from "@/store/modules/app";
import { useUserStore } from "@/store/modules/user";
import Breadcrumb from "./Breadcrumb.vue";
import ThemeColorPicker from "./ThemeColorPicker.vue";

const router = useRouter();
const appStore = useAppStore();
const userStore = useUserStore();

const sidebar = computed(() => appStore.sidebar);
const theme = computed(() => appStore.theme);

const toggleSidebar = () => {
  appStore.toggleSidebar();
};

const toggleTheme = () => {
  appStore.toggleTheme();
};

const handleCommand = (command: string) => {
  if (command === "logout") {
    ElMessageBox.confirm("确定要退出登录吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }).then(() => {
      userStore.logout();
      router.push("/login");
    });
  } else if (command === "profile") {
    // 跳转到个人中心
  }
};
</script>

<style scoped lang="scss">
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: var(--navbar-bg);
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  transition: background-color 0.3s;

  .left-menu {
    display: flex;
    align-items: center;
    gap: 20px;

    .hamburger {
      font-size: 24px;
      cursor: pointer;
      color: var(--text-color-secondary);

      &:hover {
        color: var(--theme-color);
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

    .theme-toggle {
      font-size: 20px;
      cursor: pointer;
      color: var(--text-color-secondary);
      transition: all 0.3s;

      &:hover {
        color: var(--theme-color);
        transform: rotate(180deg);
      }
    }

    .avatar-container {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      transition: all 0.3s;

      .username {
        font-size: 14px;
        color: var(--navbar-text);
        transition: color 0.3s;
      }

      &:hover {
        .username {
          color: var(--theme-color) !important;
        }
      }
    }
  }
}
</style>
