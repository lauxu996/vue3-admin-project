# Token 无感刷新功能使用说明

## 功能概述

本项目已实现 Token 无感刷新功能，可以在用户无感知的情况下自动刷新过期的 Token，提升用户体验。

## 实现原理

### 1. 双 Token 机制
- **Access Token（访问令牌）**：短期有效（如 2 小时），用于日常 API 请求
- **Refresh Token（刷新令牌）**：长期有效（如 7 天），用于刷新 Access Token

### 2. 自动刷新流程
```
用户请求 API
    ↓
检查 Access Token
    ↓
Token 有效 → 正常请求
    ↓
Token 过期 → 自动刷新
    ↓
使用 Refresh Token 获取新的 Access Token
    ↓
保存新 Token → 重试原请求
    ↓
返回结果给用户
```

### 3. 请求队列机制
- 当多个请求同时检测到 Token 过期时，只会发起一次刷新请求
- 其他请求会进入等待队列，等待刷新完成后使用新 Token 重试

## 核心文件说明

### 1. 类型定义 (`src/types/user.ts`)
```typescript
// 登录响应数据
export interface LoginResult {
  accessToken: string      // 访问令牌
  refreshToken: string     // 刷新令牌
  expiresIn?: number      // 过期时间（秒）
  userInfo: UserInfo
}

// Token 刷新响应
export interface RefreshTokenResult {
  accessToken: string
  refreshToken: string
  expiresIn?: number
}
```

### 2. 存储工具 (`src/utils/storage.ts`)
提供 Token 的本地存储管理：
- `getToken()` / `setToken()` - 管理 Access Token
- `getRefreshToken()` / `setRefreshToken()` - 管理 Refresh Token
- `clearAuth()` - 清除所有认证信息

### 3. 请求封装 (`src/utils/request.ts`)
核心实现：
- **请求拦截器**：自动添加 Authorization 头
- **响应拦截器**：检测 401 错误，触发 Token 刷新
- **刷新机制**：
  - `isRefreshing`：防止并发刷新
  - `requestsQueue`：存储等待重试的请求
  - `handleTokenExpired()`：处理 Token 过期逻辑

### 4. 认证 API (`src/api/auth.ts`)
```typescript
// 刷新 Token API
export function refreshToken(refreshToken: string): Promise<ApiResponse<RefreshTokenResult>>
```

### 5. 用户状态管理 (`src/store/modules/user.ts`)
```typescript
const userStore = useUserStore()
userStore.setToken(accessToken)           // 设置访问令牌
userStore.setRefreshToken(refreshToken)   // 设置刷新令牌
```

## 后端接口要求

### 1. 登录接口
**请求：** `POST /auth/login`
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**响应：**
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 7200,
    "userInfo": {
      "id": 1,
      "username": "admin",
      "nickname": "管理员",
      "roles": ["admin"],
      "permissions": ["*:*:*"]
    }
  }
}
```

### 2. 刷新 Token 接口
**请求：** `POST /auth/refreshToken`
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**响应：**
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "accessToken": "new_access_token",
    "refreshToken": "new_refresh_token",
    "expiresIn": 7200
  }
}
```

### 3. 业务接口
所有业务接口在 Token 过期时应返回 401 状态码：
```json
{
  "code": 401,
  "msg": "Token 已过期"
}
```

## 使用示例

### 1. 登录时保存 Token
```typescript
import { login } from '@/api/auth'
import { useUserStore } from '@/store/modules/user'

const userStore = useUserStore()

// 登录
const res = await login({ username: 'admin', password: 'admin123' })
const { accessToken, refreshToken, userInfo } = res.data

// 保存到 Store
userStore.setToken(accessToken)
userStore.setRefreshToken(refreshToken)
userStore.setUserInfo(userInfo)
```

### 2. 业务请求（自动刷新）
```typescript
import { getUserList } from '@/api/example'

// 直接调用，无需关心 Token 是否过期
// 如果 Token 过期，会自动刷新后重试
const res = await getUserList()
console.log(res.data)
```

### 3. 登出
```typescript
import { logout } from '@/api/auth'
import { useUserStore } from '@/store/modules/user'

const userStore = useUserStore()

// 调用登出 API
await logout()
// 清除本地数据
userStore.logout()
```

## 配置说明

### 1. Token 过期状态码
在 `src/utils/request.ts` 中配置：
```typescript
// 业务状态码 401
if (code === 401) {
  return handleTokenExpired(config)
}

// HTTP 状态码 401
if (status === 401) {
  return handleTokenExpired(config)
}
```

### 2. API 基础路径
在环境变量文件中配置：
```env
# .env.local
VITE_API_BASE_URL=http://localhost:8080/api
```

## 常见问题

### 1. Refresh Token 也过期了怎么办？
- 系统会自动清除认证信息并跳转到登录页
- 用户需要重新登录

### 2. 多个请求同时过期怎么办？
- 只会发起一次刷新请求
- 其他请求会等待刷新完成后使用新 Token 重试

### 3. 如何测试 Token 刷新功能？
方法一：后端设置短过期时间（如 1 分钟）
方法二：手动修改 localStorage 中的 Token 为无效值
方法三：使用浏览器开发者工具拦截请求，返回 401

### 4. 刷新失败如何处理？
- 清除本地认证信息
- 显示错误提示
- 跳转到登录页并保留重定向地址

## 注意事项

1. **安全性**：
   - Refresh Token 应设置合理的过期时间
   - 建议使用 HttpOnly Cookie 存储 Token（需后端配合）
   - 敏感操作建议二次验证

2. **性能优化**：
   - 避免频繁刷新，建议在 Token 即将过期前主动刷新
   - 可以在响应头中返回 Token 剩余时间

3. **错误处理**：
   - 刷新失败后应清除所有认证信息
   - 避免无限重试导致死循环

## 扩展功能

### 主动刷新
可以在 Token 即将过期时主动刷新，而不是等到过期后再刷新：

```typescript
// 在路由守卫或定时器中检查
import { getToken } from '@/utils/storage'
import { refreshToken } from '@/api/auth'
import jwt_decode from 'jwt-decode'

// 检查 Token 是否即将过期（剩余时间小于 5 分钟）
function shouldRefreshToken() {
  const token = getToken()
  if (!token) return false
  
  const decoded: any = jwt_decode(token)
  const expiresIn = decoded.exp * 1000 - Date.now()
  return expiresIn < 5 * 60 * 1000 // 5 分钟
}

// 主动刷新
if (shouldRefreshToken()) {
  await refreshToken(getRefreshToken()!)
}
```

## 总结

Token 无感刷新功能已完整实现，可以大大提升用户体验。在实际使用中，只需按照后端接口要求正确配置，业务代码无需关心 Token 刷新逻辑。
