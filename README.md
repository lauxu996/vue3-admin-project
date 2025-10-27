# Vue 3 后台管理系统

基于 Vue 3 + TypeScript + Vite + Element Plus 构建的现代化后台管理系统模板。

## ✨ 特性

- 🚀 **Vue 3.5** - 最新的 Vue 3 Composition API
- 💪 **TypeScript 5.3** - 类型安全
- ⚡️ **Vite 5.1** - 极速的开发体验
- 🎨 **Element Plus 2.11** - 丰富的 UI 组件
- 🔐 **权限控制** - 基于角色的访问控制（RBAC）
- 🔄 **Token 无感刷新** - 自动刷新过期 Token，提升用户体验
- 📦 **Pinia 2.1** - 轻量级状态管理
- 🛣️ **Vue Router 4.4** - 动态路由
- 📱 **响应式布局** - 支持移动端适配

## 📦 安装

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产环境
pnpm build:prod

# 预览构建结果
pnpm preview
```

## 🔑 Token 无感刷新功能

本项目已实现 Token 无感刷新功能，详细说明请查看 [TOKEN_REFRESH_GUIDE.md](./TOKEN_REFRESH_GUIDE.md)

### 核心特性
- ✅ 双 Token 机制（Access Token + Refresh Token）
- ✅ 自动刷新过期 Token
- ✅ 请求队列机制，避免并发刷新
- ✅ 刷新失败自动跳转登录页

### 测试页面
登录后访问 `系统管理 -> Token测试` 可以测试 Token 刷新功能。

## 📁 项目结构

```
src/
├── api/               # API 接口定义
├── components/        # 全局组件
├── layout/            # 布局组件
├── router/            # 路由配置
├── store/             # Pinia 状态管理
├── types/             # TypeScript 类型定义
├── utils/             # 工具函数
├── views/             # 页面视图组件
├── main.ts            # 应用入口
└── App.vue            # 根组件
```

## 🔧 核心功能

### 1. 用户认证
- 登录/登出
- Token 管理
- 自动刷新 Token

### 2. 权限控制
- 基于角色的路由访问控制
- 动态路由生成
- 按钮级权限控制

### 3. 布局系统
- 侧边栏菜单
- 顶部导航栏
- 标签页导航
- 面包屑导航

### 4. 系统管理
- 用户管理
- 角色管理
- 菜单管理

## 📝 开发指南

### 新增页面

1. 在 `src/views` 下创建 `.vue` 文件
2. 在 `src/router/routes.ts` 的 `asyncRoutes` 中添加路由配置
3. 配置 `meta` 信息（title、icon、roles）

示例：
```typescript
{
  path: 'example',
  name: 'Example',
  component: () => import('@/views/example/index.vue'),
  meta: {
    title: '示例页面',
    icon: 'Document',
    roles: ['admin']
  }
}
```

### API 调用

在 `src/api` 目录下创建 API 文件：

```typescript
import { request } from '@/utils/request'

export function getList() {
  return request({
    url: '/example/list',
    method: 'get'
  })
}
```

## 🌐 环境变量

### 快速开始

1. 复制环境变量配置模板：
```bash
cp .env.local.example .env.local
```

2. 修改 `.env.local` 中的配置，特别是 API 地址：
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### 环境文件说明

| 文件 | 说明 | 适用命令 |
|------|------|----------|
| `.env` | 公共配置 | 所有环境 |
| `.env.local` | 本地开发 | `pnpm dev` |
| `.env.dev` | 开发环境 | `pnpm dev-server` / `pnpm build:dev` |
| `.env.test` | 测试环境 | `pnpm build:test` |
| `.env.stage` | 预发布环境 | `pnpm build:stage` |
| `.env.prod` | 生产环境 | `pnpm build:prod` |

### 主要配置项

```env
# API 基础路径
VITE_API_BASE_URL=http://localhost:8080/api

# 是否启用 Mock 数据
VITE_USE_MOCK=true

# 是否开启代理
VITE_USE_PROXY=true
```

### 相关文档
- [ENV_QUICK_REFERENCE.md](./ENV_QUICK_REFERENCE.md) - 快速参考
- [ENV_VARIABLES_GUIDE.md](./ENV_VARIABLES_GUIDE.md) - 详细指南

## 📄 License

MIT

## 🙏 致谢

- [Vue 3](https://vuejs.org/)
- [Element Plus](https://element-plus.org/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
