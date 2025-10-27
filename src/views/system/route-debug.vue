<template>
  <div class="route-debug-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>路由调试工具</span>
          <el-button type="primary" @click="refreshData">刷新数据</el-button>
        </div>
      </template>

      <!-- 用户信息 -->
      <el-descriptions title="用户信息" :column="2" border>
        <el-descriptions-item label="用户名">
          {{ userStore.username || '未登录' }}
        </el-descriptions-item>
        <el-descriptions-item label="角色">
          <el-tag v-for="role in userStore.roles" :key="role" type="success">
            {{ role }}
          </el-tag>
          <span v-if="userStore.roles.length === 0" style="color: #999">无</span>
        </el-descriptions-item>
        <el-descriptions-item label="权限">
          <el-tag v-for="perm in userStore.permissions.slice(0, 3)" :key="perm" size="small">
            {{ perm }}
          </el-tag>
          <span v-if="userStore.permissions.length > 3">...</span>
        </el-descriptions-item>
        <el-descriptions-item label="是否生成路由">
          <el-tag :type="permissionStore.isRoutesGenerated ? 'success' : 'danger'">
            {{ permissionStore.isRoutesGenerated ? '是' : '否' }}
          </el-tag>
        </el-descriptions-item>
      </el-descriptions>

      <!-- 动态路由列表 -->
      <el-card style="margin-top: 20px">
        <template #header>
          <span>动态路由列表（{{ permissionStore.routes.length }}）</span>
        </template>
        <el-tree
          :data="dynamicRoutesTree"
          :props="treeProps"
          default-expand-all
        >
          <template #default="{ node, data }">
            <span class="custom-tree-node">
              <span>
                <el-icon v-if="data.icon" style="margin-right: 5px">
                  <component :is="data.icon" />
                </el-icon>
                {{ node.label }}
              </span>
              <span>
                <el-tag v-if="data.hidden" type="info" size="small">隐藏</el-tag>
                <el-tag v-if="data.roles && data.roles.length > 0" type="warning" size="small">
                  {{ data.roles.join(', ') }}
                </el-tag>
                <el-tag type="success" size="small">{{ data.path }}</el-tag>
              </span>
            </span>
          </template>
        </el-tree>
      </el-card>

      <!-- 常驻路由列表 -->
      <el-card style="margin-top: 20px">
        <template #header>
          <span>常驻路由列表（{{ constantRoutes.length }}）</span>
        </template>
        <el-tree
          :data="constantRoutesTree"
          :props="treeProps"
          default-expand-all
        >
          <template #default="{ node, data }">
            <span class="custom-tree-node">
              <span>
                <el-icon v-if="data.icon" style="margin-right: 5px">
                  <component :is="data.icon" />
                </el-icon>
                {{ node.label }}
              </span>
              <span>
                <el-tag v-if="data.hidden" type="info" size="small">隐藏</el-tag>
                <el-tag type="success" size="small">{{ data.path }}</el-tag>
              </span>
            </span>
          </template>
        </el-tree>
      </el-card>

      <!-- 所有已注册路由 -->
      <el-card style="margin-top: 20px">
        <template #header>
          <span>所有已注册路由（{{ allRoutes.length }}）</span>
        </template>
        <el-table :data="allRoutes" border stripe>
          <el-table-column prop="name" label="路由名称" width="150" />
          <el-table-column prop="path" label="路径" width="200" />
          <el-table-column label="标题" width="150">
            <template #default="{ row }">
              {{ row.meta?.title || '-' }}
            </template>
          </el-table-column>
          <el-table-column label="隐藏" width="80">
            <template #default="{ row }">
              <el-tag v-if="row.meta?.hidden" type="info" size="small">是</el-tag>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="角色" width="150">
            <template #default="{ row }">
              <el-tag
                v-for="role in row.meta?.roles || []"
                :key="role"
                size="small"
                style="margin-right: 5px"
              >
                {{ role }}
              </el-tag>
              <span v-if="!row.meta?.roles || row.meta.roles.length === 0">-</span>
            </template>
          </el-table-column>
          <el-table-column prop="redirect" label="重定向" />
        </el-table>
      </el-card>

      <!-- 诊断信息 -->
      <el-alert
        title="常见问题诊断"
        type="warning"
        style="margin-top: 20px"
        :closable="false"
      >
        <ul>
          <li v-if="userStore.roles.length === 0" style="color: #e6a23c">
            ⚠️ 用户角色为空，可能导致无法访问动态路由
          </li>
          <li v-if="!permissionStore.isRoutesGenerated" style="color: #e6a23c">
            ⚠️ 路由尚未生成，请刷新页面或重新登录
          </li>
          <li v-if="permissionStore.routes.length === 0" style="color: #e6a23c">
            ⚠️ 动态路由为空，请检查角色权限配置
          </li>
          <li v-if="allRoutes.length === 0" style="color: #f56c6c">
            ❌ 未找到任何已注册路由，路由系统可能未正常初始化
          </li>
          <li v-if="!hasSystemRoute" style="color: #f56c6c">
            ❌ 动态路由未注册到 router，请刷新页面
          </li>
          <li v-if="!isPersisted" style="color: #e6a23c">
            ⚠️ 权限路由未持久化，刷新页面可能导致菜单消失
          </li>
          <li v-if="diagnosticPassed" style="color: #67c23a">
            ✅ 路由系统正常
          </li>
        </ul>
      </el-alert>

      <!-- 修复建议 -->
      <el-card v-if="!diagnosticPassed" style="margin-top: 20px">
        <template #header>
          <span style="color: #f56c6c">🔧 修复建议</span>
        </template>
        <el-steps direction="vertical" :active="0">
          <el-step v-if="!isPersisted" title="步骤 1：检查持久化配置">
            <template #description>
              <div>
                <p>确认 <code>src/store/modules/permission.ts</code> 中配置了持久化：</p>
                <pre style="background: #f5f7fa; padding: 10px; border-radius: 4px; overflow-x: auto">
export const usePermissionStore = defineStore(
  'permission',
  () => /* ... */,
  {
    persist: {
      key: 'permission-store',
      storage: localStorage,
      paths: ['routes', 'isRoutesGenerated']
    }
  }
)</pre>
              </div>
            </template>
          </el-step>
          <el-step v-if="!hasSystemRoute" title="步骤 2：刷新页面">
            <template #description>
              <p>路由数据已保存但未注册，请按 F5 刷新页面</p>
              <el-button type="primary" @click="reloadPage">立即刷新</el-button>
            </template>
          </el-step>
          <el-step v-if="userStore.roles.length === 0" title="步骤 3：重新登录">
            <template #description>
              <p>用户角色为空，请退出后重新登录</p>
              <el-button type="danger" @click="handleLogout">退出登录</el-button>
            </template>
          </el-step>
        </el-steps>
      </el-card>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { usePermissionStore } from '@/store/modules/permission'
import { constantRoutes } from '@/router/routes'

const router = useRouter()
const userStore = useUserStore()
const permissionStore = usePermissionStore()

// 树形结构配置
const treeProps = {
  children: 'children',
  label: 'label'
}

// 转换路由为树形结构
const convertRoutesToTree = (routes: any[]): any[] => {
  return routes.map(route => ({
    label: route.meta?.title || route.name || route.path,
    path: route.path,
    icon: route.meta?.icon,
    hidden: route.meta?.hidden,
    roles: route.meta?.roles,
    children: route.children ? convertRoutesToTree(route.children) : undefined
  }))
}

// 动态路由树
const dynamicRoutesTree = computed(() => {
  return convertRoutesToTree(permissionStore.routes)
})

// 常驻路由树
const constantRoutesTree = computed(() => {
  return convertRoutesToTree(constantRoutes)
})

// 所有已注册的路由
const allRoutes = ref<any[]>([])

// 诊断是否通过
const diagnosticPassed = computed(() => {
  return userStore.roles.length > 0 &&
    permissionStore.isRoutesGenerated &&
    permissionStore.routes.length > 0 &&
    allRoutes.value.length > 0 &&
    hasSystemRoute.value &&
    isPersisted.value
})

// 检查动态路由是否已注册
const hasSystemRoute = computed(() => {
  return allRoutes.value.some(r => r.name === 'System')
})

// 检查是否持久化
const isPersisted = computed(() => {
  const stored = localStorage.getItem('permission-store')
  return !!stored
})

// 刷新页面
const reloadPage = () => {
  window.location.reload()
}

// 退出登录
const handleLogout = () => {
  userStore.logout()
  permissionStore.reset()
  window.location.href = '/login'
}

// 刷新数据
const refreshData = () => {
  allRoutes.value = router.getRoutes()
}

onMounted(() => {
  refreshData()
})
</script>

<style scoped lang="scss">
.route-debug-container {
  padding: 20px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;

    > span:last-child {
      display: flex;
      gap: 5px;
    }
  }

  :deep(.el-alert__description) {
    ul {
      margin: 0;
      padding-left: 20px;

      li {
        margin: 8px 0;
        line-height: 1.8;
      }
    }
  }
}
</style>
