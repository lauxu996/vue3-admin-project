# Token 无感刷新功能 - 快速开始

## 📋 已完成的修改

### 1. 类型定义更新
**文件**：`src/types/user.ts`
- ✅ 将 `LoginResult` 中的 `token` 改为 `accessToken` 和 `refreshToken`
- ✅ 新增 `RefreshTokenResult` 接口

### 2. 存储工具增强
**文件**：`src/utils/storage.ts`
- ✅ 新增 `getRefreshToken()`、`setRefreshToken()`、`removeRefreshToken()` 方法
- ✅ 更新 `clearAuth()` 方法，同时清除 refresh token

### 3. 请求拦截器核心实现
**文件**：`src/utils/request.ts`
- ✅ 新增刷新状态标志 `isRefreshing`
- ✅ 新增请求队列 `requestsQueue`
- ✅ 实现 `handleTokenExpired()` 函数处理 Token 过期
- ✅ 实现 `toLogin()` 函数处理登录跳转
- ✅ 更新响应拦截器，自动处理 401 错误

### 4. 认证 API 扩展
**文件**：`src/api/auth.ts`
- ✅ 新增 `refreshToken()` API 方法

### 5. 用户状态管理
**文件**：`src/store/modules/user.ts`
- ✅ 新增 `refreshToken` 状态
- ✅ 新增 `setRefreshToken()` 方法
- ✅ 初始化时从 localStorage 读取 token

### 6. 登录页面适配
**文件**：`src/views/login/index.vue`
- ✅ 更新登录逻辑，同时保存 accessToken 和 refreshToken

### 7. 测试页面
**文件**：`src/views/system/token-test.vue`
- ✅ 创建 Token 测试页面，可视化测试刷新功能

### 8. 路由配置
**文件**：`src/router/routes.ts`
- ✅ 添加 Token 测试页面路由

### 9. 示例 API
**文件**：`src/api/example.ts`
- ✅ 创建示例 API，演示如何使用

### 10. 文档
- ✅ `TOKEN_REFRESH_GUIDE.md` - 详细使用指南
- ✅ `QUICK_START.md` - 快速开始指南（本文件）
- ✅ 更新 `README.md`

## 🚀 如何使用

### 前端使用（已自动集成）

1. **登录时保存 Token**
   ```typescript
   // 在登录成功后
   const { accessToken, refreshToken, userInfo } = res.data
   userStore.setToken(accessToken)
   userStore.setRefreshToken(refreshToken)
   userStore.setUserInfo(userInfo)
   ```

2. **业务请求（自动处理）**
   ```typescript
   // 直接调用 API，无需关心 Token 是否过期
   const res = await getUserList()
   // 如果 Token 过期，会自动刷新并重试
   ```

3. **登出清除 Token**
   ```typescript
   userStore.logout()
   ```

### 后端接口要求

您需要在后端实现以下接口：

#### 1. 登录接口
```
POST /api/auth/login
```
**请求体**：
```json
{
  "username": "admin",
  "password": "admin123"
}
```
**响应**：
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

#### 2. 刷新 Token 接口（必须实现）
```
POST /api/auth/refreshToken
```
**请求体**：
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
**响应**：
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

#### 3. Token 过期时的响应
所有业务接口在 Token 过期时应返回：
```json
{
  "code": 401,
  "msg": "Token 已过期"
}
```
或 HTTP 状态码 401

## 🧪 测试功能

### 方法一：使用测试页面
1. 登录系统（用户名：admin，密码：admin123）
2. 访问 `系统管理 -> Token测试` 页面
3. 点击相应按钮测试各种场景

### 方法二：手动测试
1. 打开浏览器开发者工具（F12）
2. 进入 Console 标签
3. 执行以下代码：

```javascript
// 1. 模拟 Token 过期
localStorage.setItem('ACCESS_TOKEN', 'invalid-token')

// 2. 发送一个 API 请求（会自动触发刷新）
// 然后观察 Network 标签，应该会看到：
// - 一个失败的业务请求（401）
// - 一个刷新 Token 的请求
// - 重试的业务请求（成功）

// 3. 查看新 Token
console.log(localStorage.getItem('ACCESS_TOKEN'))
```

### 方法三：后端设置短过期时间
在后端将 Access Token 过期时间设置为 1-2 分钟，然后正常使用系统，等待过期后观察自动刷新效果。

## ⚠️ 注意事项

### 当前使用模拟数据
由于后端接口尚未实现，当前代码使用模拟数据：
- 登录时生成模拟 Token
- **刷新接口会调用真实后端**（`/api/auth/refreshToken`）

### 真实环境使用
1. 确保后端已实现刷新 Token 接口
2. 修改 `src/views/login/index.vue` 中的登录逻辑，调用真实 API：
   ```typescript
   // 取消注释真实 API 调用
   const res = await login(loginForm)
   const { accessToken, refreshToken, userInfo } = res.data
   
   // 删除或注释模拟数据部分
   ```

3. 配置正确的 API 地址：
   ```env
   # .env.local
   VITE_API_BASE_URL=http://your-backend-url/api
   ```

## 📊 工作流程图

```
用户发起请求
    ↓
检查 Access Token 是否有效
    ├─ 有效 → 正常请求 → 返回结果
    └─ 无效（401）
        ↓
    检查 Refresh Token
        ├─ 无 → 跳转登录页
        └─ 有
            ↓
        检查是否正在刷新
            ├─ 是 → 加入等待队列
            └─ 否 → 发起刷新请求
                ↓
            刷新成功？
                ├─ 是 → 保存新 Token → 重试所有等待请求
                └─ 否 → 清除认证 → 跳转登录页
```

## 🔍 调试技巧

### 查看请求日志
在 `src/utils/request.ts` 中添加日志：
```typescript
// 在 handleTokenExpired 函数中
console.log('Token 已过期，开始刷新...')
console.log('当前队列长度：', requestsQueue.length)
```

### 查看 Token 值
```javascript
// 浏览器控制台
console.log('Access Token:', localStorage.getItem('ACCESS_TOKEN'))
console.log('Refresh Token:', localStorage.getItem('REFRESH_TOKEN'))
```

### 监控网络请求
1. 打开开发者工具 Network 标签
2. 筛选 XHR 请求
3. 观察是否有 refreshToken 请求
4. 检查请求头中的 Authorization 字段

## ❓ 常见问题

### Q1: 刷新 Token 后仍然返回 401？
**A**: 检查以下几点：
- 后端是否正确实现刷新接口
- 新 Token 是否正确保存到 localStorage
- 重试请求是否正确添加新 Token

### Q2: 多个请求同时触发多次刷新？
**A**: 检查 `isRefreshing` 标志是否正常工作，确保在刷新期间新请求进入队列而不是重复刷新。

### Q3: 刷新成功但原请求没有重试？
**A**: 检查请求队列逻辑，确保 `requestsQueue.forEach()` 正确执行。

### Q4: Refresh Token 也过期了怎么办？
**A**: 系统会自动清除认证信息并跳转到登录页，用户需要重新登录。

## 📞 技术支持

如有问题，请查看：
1. [TOKEN_REFRESH_GUIDE.md](./TOKEN_REFRESH_GUIDE.md) - 详细技术文档
2. [README.md](./README.md) - 项目说明
3. 测试页面中的使用说明

---

**祝您使用愉快！** 🎉
