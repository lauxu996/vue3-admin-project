# 动态路由页面空白 - 终极解决方案

## 当前配置状态

### ✅ 已完成的修改

1. **`src/router/routes.ts`**
   - `/system` 路由直接使用 `Layout` 组件
   - 子路由会在 Layout 的 `<router-view>` 中渲染

2. **`src/router/guard.ts`**
   - 直接使用 `router.addRoute(route)` 添加整个路由
   - 添加了调试日志

3. **`src/router/routes.ts`** (`/` 路由)
   - 添加了 `name: 'Layout'`

## 请按以下步骤排查

### 步骤 1：清除缓存并重新登录

```bash
1. 打开浏览器开发者工具（F12）
2. 右键点击刷新按钮 → "清空缓存并硬性重新加载"
3. 或者使用快捷键：Ctrl + Shift + Delete
4. 清除"缓存的图片和文件"
5. 重新访问 http://localhost:3001/
6. 重新登录
```

### 步骤 2：查看控制台输出

登录后，控制台应该输出：

```javascript
添加路由: System /system
所有已注册路由: [
  { name: 'Login', path: '/login' },
  { name: '404', path: '/404' },
  { name: 'Layout', path: '/' },
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'System', path: '/system' },        // ← 这个很重要！
  { name: 'SystemUser', path: '/system/user' }, // ← 子路由
  ...
]
```

**如果看不到这些日志，说明路由守卫没有执行！**

### 步骤 3：访问路由调试页面

```
1. 登录后，在地址栏直接输入：
   http://localhost:3001/system/route-debug

2. 查看诊断信息
```

### 步骤 4：手动测试路由跳转

在浏览器控制台执行：

```javascript
// 测试1：查看所有路由
$router.getRoutes().map(r => r.name)

// 测试2：查找 System 路由
$router.getRoutes().find(r => r.name === 'System')

// 测试3：手动跳转
$router.push('/system/user')
```

## 可能的问题和解决方案

### 问题1：控制台没有"添加路由"日志

**原因**：路由守卫没有执行或登录状态异常

**解决**：
```javascript
// 检查 Token
localStorage.getItem('ACCESS_TOKEN')

// 检查用户信息
localStorage.getItem('user-store')

// 如果都为空，重新登录
```

### 问题2：有路由日志但点击菜单无反应

**原因**：菜单组件缺少 `router` 属性

**解决**：检查 `src/layout/components/Sidebar/index.vue`

```vue
<el-menu
  router  <!-- 必须有这个属性 -->
>
```

### 问题3：路由已注册但页面空白

**原因**：组件加载失败

**检查**：
1. 组件文件是否存在
2. 组件路径是否正确
3. Network 是否有 404 错误

### 问题4：URL 改变但内容不变

**原因**：Layout 组件缺少 `<router-view>`

**检查**：`src/layout/components/AppMain.vue`

```vue
<template>
  <section class="app-main">
    <router-view>  <!-- 必须有 -->
      ...
    </router-view>
  </section>
</template>
```

## 完整的诊断命令

在浏览器控制台依次执行：

```javascript
// 1. 检查登录状态
console.log('Token:', localStorage.getItem('ACCESS_TOKEN'))
console.log('User:', localStorage.getItem('user-store'))

// 2. 检查路由
console.log('Routes:', $router.getRoutes().map(r => ({
  name: r.name, 
  path: r.path
})))

// 3. 检查 System 路由
const systemRoute = $router.getRoutes().find(r => r.name === 'System')
console.log('System Route:', systemRoute)
console.log('System Children:', systemRoute?.children)

// 4. 检查当前路由
console.log('Current:', $router.currentRoute.value)

// 5. 尝试跳转
$router.push('/system/user').then(() => {
  console.log('跳转成功')
}).catch(err => {
  console.error('跳转失败:', err)
})
```

## 如果以上都不行

请提供以下信息：

1. **浏览器控制台的完整截图**
2. **Network 标签的请求列表**
3. **上述诊断命令的输出结果**
4. **页面的实际显示情况**（是完全空白还是部分空白）

---

## 备用方案

如果实在无法解决，可以考虑回退到最简单的方案：

```typescript
// src/router/routes.ts
export const asyncRoutes = [
  {
    path: '/system',
    redirect: '/system/user',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '/system/user',  // 使用绝对路径
        name: 'SystemUser',
        component: () => import('@/views/system/user/index.vue'),
        meta: { title: '用户管理', icon: 'User', roles: ['admin'] }
      }
    ]
  }
]
```

这样的好处是：
- 路径明确，不会出错
- 不需要复杂的路径拼接逻辑
- 调试更容易
