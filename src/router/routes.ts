/**
 * 路由配置
 */
import type { AppRouteRecordRaw } from '@/types/router'

/**
 * 常驻路由（不需要权限）
 */
export const constantRoutes: AppRouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
      hidden: true
    }
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/error/404.vue'),
    meta: {
      title: '404',
      hidden: true
    }
  },
  {
    path: '/',
    name: 'Layout',
    redirect: '/dashboard',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: {
          title: '首页',
          icon: 'HomeFilled',
          affix: true
        }
      }
    ]
  }
]

/**
 * 动态路由（需要权限）
 */
export const asyncRoutes: AppRouteRecordRaw[] = [
  {
    path: '/system',
    name: 'System',
    component: () => import('@/layout/index.vue'),
    redirect: '/system/user',
    meta: {
      title: '系统管理',
      icon: 'Setting',
      roles: ['admin']
    },
    children: [
      {
        path: 'user',
        name: 'SystemUser',
        component: () => import('@/views/system/user/index.vue'),
        meta: {
          title: '用户管理',
          icon: 'User',
          roles: ['admin']
        }
      },
      {
        path: 'role',
        name: 'SystemRole',
        component: () => import('@/views/system/role/index.vue'),
        meta: {
          title: '角色管理',
          icon: 'UserFilled',
          roles: ['admin']
        }
      },
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
      {
        path: 'token-test',
        name: 'TokenTest',
        component: () => import('@/views/system/token-test.vue'),
        meta: {
          title: 'Token测试',
          icon: 'Lock',
          roles: ['admin']
        }
      },
      {
        path: 'env-config',
        name: 'EnvConfig',
        component: () => import('@/views/system/env-config.vue'),
        meta: {
          title: '环境配置',
          icon: 'Setting',
          roles: ['admin']
        }
      },
      {
        path: 'route-debug',
        name: 'RouteDebug',
        component: () => import('@/views/system/route-debug.vue'),
        meta: {
          title: '路由调试',
          icon: 'Monitor',
          roles: ['admin']
        }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    meta: {
      hidden: true
    }
  }
]
