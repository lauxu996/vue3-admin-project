/**
 * 路由守卫
 */
import type { Router } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/storage'
import { useUserStore } from '@/store/modules/user'
import { usePermissionStore } from '@/store/modules/permission'
import { asyncRoutes } from './routes'

NProgress.configure({ showSpinner: false })

// 白名单（不需要登录的页面）
const whiteList = ['/login']

/**
 * 过滤有权限的路由
 */
function filterAsyncRoutes(routes: any[], roles: string[]) {
  const res: any[] = []

  routes.forEach((route) => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

/**
 * 判断是否有权限
 */
function hasPermission(roles: string[], route: any) {
  if (route.meta && route.meta.roles) {
    return roles.some((role) => route.meta.roles.includes(role))
  }
  return true
}

/**
 * 设置路由守卫
 */
export function setupRouterGuard(router: Router) {
  router.beforeEach(async (to, _from, next) => {
    NProgress.start()

    const userStore = useUserStore()
    const permissionStore = usePermissionStore()
    const token = getToken()

    if (token) {
      // 已登录
      if (to.path === '/login') {
        // 如果已登录，跳转到首页
        next({ path: '/' })
        NProgress.done()
      } else {
        // 判断是否已生成路由
        if (!permissionStore.isRoutesGenerated || userStore.roles.length === 0) {
          try {
            // 如果没有用户信息，先获取
            if (userStore.roles.length === 0) {
              // 获取用户信息
              // const userInfo = await getUserInfo()
              // userStore.setUserInfo(userInfo)

              // 模拟获取用户信息（实际项目中需要调用 API）
              const mockUserInfo = {
                id: 1,
                username: 'admin',
                nickname: '管理员',
                avatar: '',
                email: 'admin@example.com',
                phone: '13800138000',
                roles: ['admin'],
                permissions: ['*:*:*']
              }
              userStore.setUserInfo(mockUserInfo)
            }

            // 根据角色过滤路由
            const accessRoutes = filterAsyncRoutes(asyncRoutes, userStore.roles)

            // 动态添加路由
            accessRoutes.forEach((route) => {
              router.addRoute(route as any)
            })

            // 打印所有已注册路由
            const allRoutes = router.getRoutes()
            console.log('📋 所有已注册路由 (', allRoutes.length, '):')
            allRoutes.forEach(r => {
              console.log('  -', r.name, '→', r.path)
            })

            // 保存到 store
            permissionStore.setRoutes(accessRoutes)

            // 重新跳转，确保 addRoute 已经完成
            next({ ...to, replace: true })
          } catch (error) {
            // 获取用户信息失败，退出登录
            console.error('路由守卫错误:', error)
            userStore.logout()
            permissionStore.reset()
            next(`/login?redirect=${to.path}`)
            NProgress.done()
          }
        } else {
          // 已生成路由，但需要确保路由已注册（处理页面刷新的情况）
          const currentRoutes = router.getRoutes()
          const hasAsyncRoutes = currentRoutes.some(r => r.name === 'System')
          
          if (!hasAsyncRoutes && permissionStore.routes.length > 0) {
            // 路由在 store 中但未注册，重新注册
            permissionStore.routes.forEach((route) => {
              router.addRoute(route as any)
            })
            next({ ...to, replace: true })
          } else {
            next()
          }
        }
      }
    } else {
      // 未登录
      if (whiteList.includes(to.path)) {
        // 在白名单中，直接进入
        next()
      } else {
        // 不在白名单中，跳转到登录页
        next(`/login?redirect=${to.path}`)
        NProgress.done()
      }
    }
  })

  router.afterEach(() => {
    NProgress.done()
  })
}
