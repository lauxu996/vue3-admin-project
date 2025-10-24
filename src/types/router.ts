import type { RouteRecordRaw } from 'vue-router'

/**
 * 路由相关类型定义
 */

// 路由元信息
export interface RouteMeta {
  title?: string // 页面标题
  icon?: string // 图标
  hidden?: boolean // 是否隐藏在菜单中
  alwaysShow?: boolean // 总是显示根菜单
  noCache?: boolean // 是否不缓存
  affix?: boolean // 是否固定在标签页
  breadcrumb?: boolean // 是否显示在面包屑
  activeMenu?: string // 高亮的菜单路径
  roles?: string[] // 可访问的角色
  permissions?: string[] // 可访问的权限
}

// 扩展路由类型
export interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'meta' | 'children'> {
  meta?: RouteMeta
  children?: AppRouteRecordRaw[]
  hidden?: boolean
}
