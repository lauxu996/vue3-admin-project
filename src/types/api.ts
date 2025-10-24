/**
 * API 响应相关类型定义
 */

// API 响应基础结构
export interface ApiResponse<T = any> {
  code: number
  data: T
  msg: string
}

// 分页请求参数
export interface PageParams {
  pageNo: number
  pageSize: number
}

// 分页响应数据
export interface PageResult<T = any> {
  list: T[]
  total: number
}
