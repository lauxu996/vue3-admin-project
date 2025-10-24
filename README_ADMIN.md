# 后台管理系统使用指南

## 项目简介

这是一个基于 Vue 3 + TypeScript + Element Plus 构建的标准后台管理系统框架，已完成登录、路由权限控制等核心功能。

## 功能特性

- ✅ **用户认证**：完整的登录/登出功能
- ✅ **权限控制**：基于角色的路由权限管理
- ✅ **动态路由**：根据用户权限动态生成菜单
- ✅ **布局系统**：侧边栏、顶部栏、面包屑、标签页导航
- ✅ **状态管理**：Pinia 全局状态管理
- ✅ **HTTP 请求**：Axios 封装，统一请求/响应处理
- ✅ **TypeScript**：完整的类型定义支持

## 项目结构

```
src/
├── api/                  # API 接口
│   └── auth.ts          # 认证相关接口
├── layout/              # 布局组件
│   ├── components/      # 布局子组件
│   └── index.vue        # 主布局
├── router/              # 路由配置
│   ├── routes.ts        # 路由定义
│   ├── guard.ts         # 路由守卫
│   └── index.ts         # 路由入口
├── store/               # 状态管理
│   ├── modules/         # 各模块 store
│   │   ├── user.ts     # 用户信息
│   │   ├── permission.ts # 权限
│   │   ├── tagsView.ts # 标签页
│   │   └── app.ts      # 应用配置
│   └── index.ts         # store 入口
├── types/               # TypeScript 类型定义
│   ├── user.ts          # 用户相关类型
│   ├── router.ts        # 路由相关类型
│   └── api.ts           # API 相关类型
├── utils/               # 工具函数
│   ├── request.ts       # axios 封装
│   ├── storage.ts       # 本地存储
│   └── permission.ts    # 权限验证
├── views/               # 页面组件
│   ├── login/           # 登录页
│   ├── dashboard/       # 首页
│   ├── system/          # 系统管理
│   └── error/           # 错误页面
├── App.vue              # 根组件
├── main.ts              # 入口文件
└── style.css            # 全局样式
```

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 启动项目

```bash
pnpm dev
```

### 3. 登录系统

访问 http://localhost:3000，使用以下账号登录：

- 用户名：`admin`
- 密码：`admin123`

## 如何新增页面

### 方法一：添加到现有菜单下

1. **创建页面文件**

在 `src/views` 下创建新页面，例如 `src/views/example/list.vue`：

```vue
<template>
  <div class="example-container">
    <el-card>
      <template #header>
        <span>示例列表</span>
      </template>
      <div>页面内容</div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
// 页面逻辑
</script>

<style scoped lang="scss">
.example-container {
  // 样式
}
</style>
```

2. **添加路由配置**

在 `src/router/routes.ts` 的 `asyncRoutes` 数组中添加路由：

```typescript
{
  path: '/example',
  name: 'Example',
  redirect: '/example/list',
  component: () => import('@/layout/index.vue'),
  meta: {
    title: '示例模块',
    icon: 'Document',
    roles: ['admin'] // 可访问的角色
  },
  children: [
    {
      path: 'list',
      name: 'ExampleList',
      component: () => import('@/views/example/list.vue'),
      meta: {
        title: '示例列表',
        icon: 'List'
      }
    }
  ]
}
```

3. **刷新页面**

保存后刷新浏览器，新页面会自动显示在侧边栏菜单中。

### 方法二：添加新的一级菜单

直接在 `asyncRoutes` 中添加新的路由对象即可，参考现有的 `system` 模块配置。

## 路由配置说明

### 路由 Meta 配置项

```typescript
{
  title: '页面标题',           // 显示在菜单、标签页、面包屑中
  icon: 'User',               // Element Plus 图标名称
  hidden: false,              // 是否在菜单中隐藏
  alwaysShow: false,          // 是否总是显示根菜单
  noCache: false,             // 是否不缓存页面
  affix: false,               // 是否固定在标签页
  breadcrumb: true,           // 是否显示在面包屑
  activeMenu: '/xxx',         // 激活的菜单路径
  roles: ['admin', 'user'],   // 可访问的角色
  permissions: ['system:user:query'] // 可访问的权限
}
```

### 常用图标

Element Plus 图标可在以下列表中选择：

- `User` - 用户
- `Setting` - 设置
- `Document` - 文档
- `Menu` - 菜单
- `List` - 列表
- `Edit` - 编辑
- `Delete` - 删除
- `Plus` - 新增
- `Search` - 搜索
- `Refresh` - 刷新

更多图标请参考：https://element-plus.org/zh-CN/component/icon.html

## API 调用示例

### 1. 定义 API 接口

在 `src/api` 下创建文件，例如 `src/api/example.ts`：

```typescript
import { request } from '@/utils/request'
import type { ApiResponse } from '@/types/api'

export interface ExampleItem {
  id: number
  name: string
}

// 获取列表
export function getExampleList() {
  return request<ApiResponse<ExampleItem[]>>({
    url: '/example/list',
    method: 'get'
  })
}

// 新增
export function createExample(data: Partial<ExampleItem>) {
  return request<ApiResponse<void>>({
    url: '/example/create',
    method: 'post',
    data
  })
}
```

### 2. 在页面中使用

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getExampleList } from '@/api/example'

const tableData = ref([])

const fetchData = async () => {
  try {
    const res = await getExampleList()
    tableData.value = res.data
  } catch (error) {
    console.error('获取数据失败', error)
  }
}

onMounted(() => {
  fetchData()
})
</script>
```

## 权限控制

### 1. 路由权限

在路由的 `meta.roles` 中配置可访问的角色：

```typescript
{
  path: 'user',
  name: 'SystemUser',
  component: () => import('@/views/system/user/index.vue'),
  meta: {
    title: '用户管理',
    roles: ['admin'] // 只有 admin 角色可访问
  }
}
```

### 2. 按钮权限

使用权限指令（需自行实现）或判断函数：

```vue
<script setup lang="ts">
import { hasPermission } from '@/utils/permission'
</script>

<template>
  <el-button v-if="hasPermission(['system:user:create'])" type="primary">
    新增用户
  </el-button>
</template>
```

## 状态管理

### 使用 Store

```vue
<script setup lang="ts">
import { useUserStore } from '@/store/modules/user'

const userStore = useUserStore()

// 访问状态
console.log(userStore.username)
console.log(userStore.roles)

// 调用方法
userStore.logout()
</script>
```

## 环境变量

在 `.env.local` 文件中配置环境变量：

```
VITE_API_BASE_URL=/api
```

在代码中使用：

```typescript
const apiUrl = import.meta.env.VITE_API_BASE_URL
```

## 常见问题

### 1. 如何修改默认登录账号？

编辑 `src/router/guard.ts` 中的 `mockUserInfo` 对象。

### 2. 如何对接真实后端 API？

- 在 `src/api/auth.ts` 中取消注释真实 API 调用
- 在 `src/router/guard.ts` 中取消注释真实 API 调用
- 配置 `.env.local` 中的 `VITE_API_BASE_URL`

### 3. 如何修改侧边栏颜色？

编辑 `src/layout/components/Sidebar/index.vue` 中的 `background-color` 等属性。

### 4. 如何禁用标签页功能？

在 `src/layout/index.vue` 中注释掉 `<TagsView />` 组件。

## 技术栈

- **框架**: Vue 3.5
- **语言**: TypeScript 5.3
- **构建**: Vite 5.1
- **UI**: Element Plus 2.11
- **路由**: Vue Router 4.4
- **状态**: Pinia 2.1
- **HTTP**: Axios 1.9
- **工具**: NProgress, Day.js 等

## 联系与支持

如有问题，请查看项目文档或提交 Issue。
