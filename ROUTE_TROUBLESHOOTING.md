# 动态路由不显示问题排查指南

## 🔍 问题现象

动态路由配置后，在侧边栏菜单中看不到对应的菜单项。

## 📋 排查步骤

### 1. 使用路由调试工具

访问 **系统管理 → 路由调试** 页面，查看：
- ✅ 用户角色是否正确
- ✅ 路由是否已生成
- ✅ 动态路由列表是否包含您的路由
- ✅ 所有已注册路由中是否包含您的路由

### 2. 检查用户角色

**问题**：用户角色为空或不匹配

**原因**：
- 登录后未正确设置用户信息
- 角色配置错误

**解决方案**：
```typescript
// 在 src/router/guard.ts 中检查
const mockUserInfo = {
  id: 1,
  username: 'admin',
  nickname: '管理员',
  roles: ['admin'], // 确保角色正确
  permissions: ['*:*:*']
}
userStore.setUserInfo(mockUserInfo)
```

### 3. 检查路由配置

**问题**：路由的 `meta.roles` 配置不匹配

**错误示例**：
```typescript
// ❌ 用户角色是 ['admin']，但路由要求 ['superadmin']
{
  path: '/system',
  meta: {
    roles: ['superadmin'] // 不匹配
  }
}
```

**正确示例**：
```typescript
// ✅ 用户角色是 ['admin']，路由要求 ['admin']
{
  path: '/system',
  meta: {
    roles: ['admin'] // 匹配
  }
}

// ✅ 或者不设置 roles（所有角色都可访问）
{
  path: '/system',
  meta: {
    title: '系统管理'
    // 不设置 roles
  }
}
```

### 4. 检查路由是否被隐藏

**问题**：路由设置了 `meta.hidden: true`

**示例**：
```typescript
// ❌ 这个路由不会在菜单中显示
{
  path: '/system',
  meta: {
    title: '系统管理',
    hidden: true // 会被隐藏
  }
}

// ✅ 移除 hidden 或设置为 false
{
  path: '/system',
  meta: {
    title: '系统管理',
    hidden: false // 或者不设置这个字段
  }
}
```

### 5. 检查路由是否正确注册

**问题**：路由在 `constantRoutes` 而不是 `asyncRoutes`

**说明**：
- `constantRoutes` - 常驻路由，不需要权限
- `asyncRoutes` - 动态路由，需要权限验证

**正确配置**：
```typescript
// src/router/routes.ts

// 需要权限的路由应该放在 asyncRoutes 中
export const asyncRoutes: AppRouteRecordRaw[] = [
  {
    path: '/system',
    name: 'System',
    component: () => import('@/layout/index.vue'),
    meta: {
      title: '系统管理',
      icon: 'Setting',
      roles: ['admin']
    },
    children: [...]
  }
]
```

### 6. 检查路径拼接问题

**问题**：子路由路径配置错误

**错误示例**：
```typescript
{
  path: '/system',
  children: [
    {
      path: '/user', // ❌ 子路由不应该以 / 开头（除非是独立路径）
      // ...
    }
  ]
}
```

**正确示例**：
```typescript
{
  path: '/system',
  children: [
    {
      path: 'user', // ✅ 相对路径
      // 最终路径为 /system/user
    }
  ]
}
```

### 7. 检查组件路径

**问题**：组件路径不存在

**检查**：
```typescript
{
  path: '/system',
  component: () => import('@/views/system/index.vue'),
  // 确保 src/views/system/index.vue 文件存在
}
```

### 8. 清除缓存重新登录

有时候路由状态被缓存，需要清除：

```javascript
// 浏览器控制台执行
localStorage.clear()
sessionStorage.clear()
// 然后重新登录
```

## 🛠️ 常见问题及解决方案

### 问题 1：登录后菜单为空

**原因**：
- 用户角色为空
- 没有匹配的动态路由

**解决**：
1. 检查路由守卫中是否正确设置用户信息
2. 确保用户角色与路由 `meta.roles` 匹配
3. 查看路由调试工具中的诊断信息

### 问题 2：部分菜单显示，部分不显示

**原因**：
- 角色权限不完整
- 某些路由配置有误

**解决**：
1. 检查每个路由的 `meta.roles` 配置
2. 确保所有子路由的角色配置正确
3. 使用路由调试工具查看具体哪些路由被过滤

### 问题 3：页面刷新后菜单消失

**原因**：
- 路由守卫未正确处理刷新逻辑
- 用户信息丢失

**解决**：
1. 检查 `src/router/guard.ts` 中的逻辑
2. 确保刷新时重新获取用户信息并生成路由
3. 检查 localStorage 中是否保存了 Token

### 问题 4：菜单显示但点击无反应

**原因**：
- 路由路径配置错误
- 组件未正确加载

**解决**：
1. 检查路由路径拼接是否正确
2. 查看浏览器控制台是否有组件加载错误
3. 确认组件文件路径正确

## 📝 调试技巧

### 1. 使用路由调试工具

访问 **系统管理 → 路由调试**，可以查看：
- 用户信息和角色
- 动态路由列表
- 常驻路由列表
- 所有已注册路由

### 2. 浏览器控制台调试

```javascript
// 查看用户信息
console.log(JSON.parse(localStorage.getItem('USER_INFO')))

// 查看所有路由
import { useRouter } from 'vue-router'
const router = useRouter()
console.log(router.getRoutes())

// 查看 Pinia Store
import { useUserStore } from '@/store/modules/user'
import { usePermissionStore } from '@/store/modules/permission'
const userStore = useUserStore()
const permissionStore = usePermissionStore()
console.log('用户角色:', userStore.roles)
console.log('动态路由:', permissionStore.routes)
```

### 3. 开发环境打印路由信息

在 `src/router/guard.ts` 中添加调试日志：

```typescript
// 在 filterAsyncRoutes 函数中
function filterAsyncRoutes(routes: any[], roles: string[]) {
  console.log('过滤路由 - 用户角色:', roles)
  console.log('过滤路由 - 原始路由:', routes)
  
  const res: any[] = []
  routes.forEach((route) => {
    const tmp = { ...route }
    const hasAuth = hasPermission(roles, tmp)
    console.log(`路由 ${route.path} 权限检查:`, hasAuth)
    
    if (hasAuth) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  
  console.log('过滤路由 - 结果:', res)
  return res
}
```

## ✅ 检查清单

部署前请确认：

- [ ] 路由配置在 `asyncRoutes` 中
- [ ] `meta.title` 已设置（菜单显示名称）
- [ ] `meta.icon` 已设置（可选）
- [ ] `meta.roles` 已正确配置或不设置（允许所有角色）
- [ ] `meta.hidden` 未设置为 `true`
- [ ] 组件路径正确且文件存在
- [ ] 子路由使用相对路径
- [ ] 用户角色与路由角色匹配
- [ ] 路由已通过路由守卫注册
- [ ] 侧边栏组件正确引用路由

## 🔗 相关文件

- [`src/router/routes.ts`](src/router/routes.ts) - 路由配置
- [`src/router/guard.ts`](src/router/guard.ts) - 路由守卫
- [`src/layout/components/Sidebar/index.vue`](src/layout/components/Sidebar/index.vue) - 侧边栏
- [`src/layout/components/Sidebar/SidebarItem.vue`](src/layout/components/Sidebar/SidebarItem.vue) - 菜单项
- [`src/store/modules/permission.ts`](src/store/modules/permission.ts) - 权限状态
- [`src/store/modules/user.ts`](src/store/modules/user.ts) - 用户状态

## 📚 参考文档

- [开发规范与新增页面指南](README_ADMIN.md)
- [Vue Router 官方文档](https://router.vuejs.org/zh/)
- [Element Plus 菜单组件](https://element-plus.org/zh-CN/component/menu.html)

---

**最后更新**: 2025-10-24
