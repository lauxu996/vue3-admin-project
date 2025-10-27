# Token 无感刷新功能 - 更新日志

## 📅 2025-10-24 - v1.0.0

### ✨ 新增功能

#### 1. 双 Token 机制
- 实现 Access Token 和 Refresh Token 双令牌系统
- Access Token 用于日常请求（短期有效）
- Refresh Token 用于刷新（长期有效）

#### 2. 自动刷新机制
- Token 过期时自动触发刷新流程
- 无需用户手动操作，完全无感知
- 支持业务状态码 401 和 HTTP 状态码 401

#### 3. 请求队列管理
- 并发请求时只触发一次刷新
- 其他请求自动加入等待队列
- 刷新完成后统一重试所有等待请求

#### 4. 智能错误处理
- Refresh Token 过期自动跳转登录页
- 保留重定向地址，登录后自动返回
- 防止重复跳转和无限循环

### 🔧 文件修改

#### 类型定义
**src/types/user.ts**
```diff
- token: string
+ accessToken: string
+ refreshToken: string
+ expiresIn?: number

+ export interface RefreshTokenResult {
+   accessToken: string
+   refreshToken: string
+   expiresIn?: number
+ }
```

#### 存储工具
**src/utils/storage.ts**
```diff
+ const REFRESH_TOKEN_KEY = 'REFRESH_TOKEN'

+ export const getRefreshToken = (): string | null
+ export const setRefreshToken = (refreshToken: string): void
+ export const removeRefreshToken = (): void

  export const clearAuth = (): void => {
    removeToken()
+   removeRefreshToken()
    removeUserInfo()
  }
```

#### 请求封装
**src/utils/request.ts**
```diff
+ import { getRefreshToken, setToken, setRefreshToken, clearAuth } from './storage'
+ import type { RefreshTokenResult } from '@/types/user'

+ let isRefreshing = false
+ let requestsQueue: Array<(token: string) => void> = []

+ async function handleTokenExpired(config: InternalAxiosRequestConfig)
+ function toLogin()

  // 响应拦截器更新
  if (code === 401) {
-   ElMessage.error('登录已过期，请重新登录')
-   window.location.href = '/login'
+   return handleTokenExpired(config)
  }
```

#### 认证 API
**src/api/auth.ts**
```diff
+ export function refreshToken(refreshToken: string): Promise<ApiResponse<RefreshTokenResult>>
```

#### 用户状态
**src/store/modules/user.ts**
```diff
+ import { getToken as getStorageToken, setToken as setStorageToken }
+ import { getRefreshToken as getStorageRefreshToken, setRefreshToken as setStorageRefreshToken }

+ const token = ref<string>(getStorageToken() || '')
+ const refreshToken = ref<string>(getStorageRefreshToken() || '')

+ const setToken = (newToken: string) => {
+   token.value = newToken
+   setStorageToken(newToken)
+ }

+ const setRefreshToken = (newRefreshToken: string) => {
+   refreshToken.value = newRefreshToken
+   setStorageRefreshToken(newRefreshToken)
+ }

  return {
+   refreshToken,
+   setRefreshToken,
  }
```

#### 登录页面
**src/views/login/index.vue**
```diff
+ import { setRefreshToken } from '@/utils/storage'

- const mockToken = 'mock-token-' + Date.now()
+ const mockAccessToken = 'mock-access-token-' + Date.now()
+ const mockRefreshToken = 'mock-refresh-token-' + Date.now()

- setToken(mockToken)
- userStore.setToken(mockToken)
+ setToken(mockAccessToken)
+ setRefreshToken(mockRefreshToken)
+ userStore.setToken(mockAccessToken)
+ userStore.setRefreshToken(mockRefreshToken)
```

### 📝 新增文件

#### 1. Token 测试页面
**src/views/system/token-test.vue**
- 可视化测试界面
- 支持正常请求测试
- 支持模拟 Token 过期
- 支持并发请求测试
- 实时日志显示

#### 2. 示例 API
**src/api/example.ts**
- 演示如何调用 API
- 自动处理 Token 刷新

#### 3. 文档
- **TOKEN_REFRESH_GUIDE.md** - 完整使用指南
- **QUICK_START.md** - 快速开始指南
- **CHANGELOG_TOKEN_REFRESH.md** - 本文件

### 🔄 路由更新

**src/router/routes.ts**
```diff
  {
    path: 'menu',
    name: 'SystemMenu',
    component: () => import('@/views/system/menu/index.vue'),
    meta: {
      title: '菜单管理',
      icon: 'Menu',
      roles: ['admin']
    }
  },
+ {
+   path: 'token-test',
+   name: 'TokenTest',
+   component: () => import('@/views/system/token-test.vue'),
+   meta: {
+     title: 'Token测试',
+     icon: 'Lock',
+     roles: ['admin']
+   }
+ }
```

### 📚 文档更新

**README.md**
- 添加 Token 无感刷新特性说明
- 更新功能列表
- 添加测试页面说明

### 🎯 核心实现逻辑

#### Token 刷新流程
```typescript
1. 检测到 401 错误
   ↓
2. 获取 Refresh Token
   ↓
3. 检查是否正在刷新
   - 是 → 加入等待队列
   - 否 → 继续
   ↓
4. 设置刷新标志
   ↓
5. 调用刷新接口
   ↓
6. 刷新成功？
   - 是 → 保存新 Token → 重试请求
   - 否 → 清除认证 → 跳转登录
   ↓
7. 执行等待队列中的请求
   ↓
8. 清除刷新标志
```

#### 并发控制
```typescript
// 第一个请求
isRefreshing = false → true
发起刷新 → 等待响应

// 第二个请求（同时到达）
isRefreshing = true
加入队列 → 等待第一个请求完成

// 第三个请求（同时到达）
isRefreshing = true
加入队列 → 等待第一个请求完成

// 刷新完成
遍历队列 → 使用新 Token 重试所有请求
```

### 🔐 安全性考虑

1. **Token 存储**
   - 当前使用 localStorage
   - 建议生产环境使用 HttpOnly Cookie（需后端配合）

2. **刷新间隔**
   - 使用 `isRefreshing` 标志防止频繁刷新
   - 避免 Token 刷新死循环

3. **错误处理**
   - Refresh Token 过期立即清除认证
   - 避免敏感信息泄露

### 🐛 已知问题

暂无

### 📋 待办事项

- [ ] 支持 Token 即将过期时主动刷新（可选）
- [ ] 添加 Token 过期时间倒计时显示（可选）
- [ ] 支持 HttpOnly Cookie 存储（需后端配合）
- [ ] 添加刷新失败重试机制（可选）

### 🙏 贡献者

- 开发者

### 📄 许可证

MIT

---

**版本**: 1.0.0  
**发布日期**: 2025-10-24  
**兼容性**: Vue 3.5+, TypeScript 5.3+, Element Plus 2.11+
