/**
 * axios 封装
 */
import axios from "axios";
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { ElMessage } from "element-plus";
import {
  getToken,
  setToken,
  setRefreshToken,
  getRefreshToken,
  clearAuth,
} from "./storage";
import { getApiBaseUrl } from "./env";
import type { ApiResponse } from "@/types/api";
import type { RefreshTokenResult } from "@/types/user";

// 创建 axios 实例
const service: AxiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 30000,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
});

// 是否正在刷新 Token
let isRefreshing = false;
// 重试队列
let requestsQueue: Array<(token: string) => void> = [];

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 添加 token
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("请求错误：", error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>): any => {
    const { data, config } = response;

    // 如果是下载文件，直接返回
    if (config.responseType === "blob") {
      return response;
    }

    const { code, msg } = data;

    // 根据业务状态码判断
    if (code === 0 || code === 200) {
      return data;
    }

    // token 过期，尝试刷新 token
    if (code === 401) {
      return handleTokenExpired(config);
    }

    // 其他错误
    ElMessage.error(msg || "请求失败");
    return Promise.reject(new Error(msg || "请求失败"));
  },
  async (error) => {
    // 处理 HTTP 错误
    if (error.response) {
      const { status, config } = error.response;

      // token 过期，尝试刷新 token
      if (status === 401) {
        return handleTokenExpired(config);
      }

      let message = "请求失败";
      switch (status) {
        case 400:
          message = "请求参数错误";
          break;
        case 403:
          message = "拒绝访问";
          break;
        case 404:
          message = "请求地址不存在";
          break;
        case 500:
          message = "服务器错误";
          break;
        default:
          message = `连接错误 ${status}`;
      }
      ElMessage.error(message);
    } else if (error.message) {
      let message = "请求失败";
      if (error.message.includes("timeout")) {
        message = "请求超时";
      } else if (error.message.includes("Network Error")) {
        message = "网络连接错误";
      }
      ElMessage.error(message);
    }

    return Promise.reject(error);
  }
);

/**
 * 处理 Token 过期
 */
async function handleTokenExpired(
  config: InternalAxiosRequestConfig
): Promise<any> {
  const refreshToken = getRefreshToken();

  // 没有 refreshToken，直接跳转登录页
  if (!refreshToken) {
    toLogin();
    return Promise.reject(new Error("登录已过期"));
  }

  // 如果正在刷新 token，将请求加入队列
  if (isRefreshing) {
    return new Promise((resolve) => {
      requestsQueue.push((token: string) => {
        if (config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        resolve(service.request(config));
      });
    });
  }

  // 开始刷新 token
  isRefreshing = true;

  try {
    // 调用刷新 token 接口
    const response = await axios.post<ApiResponse<RefreshTokenResult>>(
      `${getApiBaseUrl()}/auth/refreshToken`,
      { refreshToken },
      {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
      }
    );

    const { code, data } = response.data;

    if (code === 0 || code === 200) {
      const { accessToken, refreshToken: newRefreshToken } = data;

      // 保存新 token
      setToken(accessToken);
      setRefreshToken(newRefreshToken);

      // 重试队列中的请求
      requestsQueue.forEach((callback) => callback(accessToken));
      requestsQueue = [];

      // 重试当前请求
      if (config.headers) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return service.request(config);
    } else {
      // 刷新失败，跳转登录页
      throw new Error("刷新 Token 失败");
    }
  } catch (error) {
    // 清空队列
    requestsQueue = [];
    // 跳转登录页
    toLogin();
    return Promise.reject(error);
  } finally {
    isRefreshing = false;
  }
}

/**
 * 跳转到登录页
 */
function toLogin() {
  clearAuth();
  ElMessage.error("登录已过期，请重新登录");
  // 避免重复跳转
  if (window.location.pathname !== "/login") {
    window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
  }
}

// 导出封装的请求方法
export const request = <T = any>(config: AxiosRequestConfig): Promise<T> => {
  return service.request(config);
};

export default service;
