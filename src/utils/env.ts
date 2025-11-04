/**
 * 环境变量工具函数
 */

/**
 * 获取当前环境
 */
export function getEnv(): "local" | "dev" | "test" | "stage" | "prod" {
  return import.meta.env.VITE_ENV || "local";
}

/**
 * 是否为开发环境
 */
export function isDev(): boolean {
  return import.meta.env.MODE === "development";
}

/**
 * 是否为生产环境
 */
export function isProd(): boolean {
  return import.meta.env.MODE === "production";
}

/**
 * 是否为本地环境
 */
export function isLocal(): boolean {
  return getEnv() === "local";
}

/**
 * 获取 API 基础路径
 */
export function getApiBaseUrl(): string {
  return import.meta.env.VITE_API_BASE_URL || "/api";
}

/**
 * 获取上传地址
 */
export function getUploadUrl(): string {
  return import.meta.env.VITE_UPLOAD_URL || "/api/upload";
}

/**
 * 获取 WebSocket 地址
 */
export function getWsUrl(): string {
  return import.meta.env.VITE_WS_URL || "ws://localhost:8080/ws";
}

/**
 * 获取应用标题
 */
export function getAppTitle(): string {
  return import.meta.env.VITE_APP_TITLE || "后台管理系统";
}

/**
 * 获取应用版本
 */
export function getAppVersion(): string {
  return import.meta.env.VITE_APP_VERSION || "1.0.0";
}

/**
 * 是否启用 Mock 数据
 */
export function useMock(): boolean {
  return import.meta.env.VITE_USE_MOCK === "true";
}

/**
 * 是否开启代理
 */
export function useProxy(): boolean {
  return import.meta.env.VITE_USE_PROXY === "true";
}

/**
 * 是否显示开发工具
 */
export function showDevTools(): boolean {
  return import.meta.env.VITE_SHOW_DEV_TOOLS === "true";
}

/**
 * 是否开启 vconsole
 */
export function useVConsole(): boolean {
  return import.meta.env.VITE_USE_VCONSOLE === "true";
}

/**
 * 打印环境信息
 */
export function printEnvInfo(): void {
  console.log("=".repeat(50));
  console.log("🚀 应用信息");
  console.log("=".repeat(50));
  console.log("应用标题:", getAppTitle());
  console.log("应用版本:", getAppVersion());
  console.log("当前环境:", getEnv());
  console.log("运行模式:", import.meta.env.MODE);
  console.log("API 地址:", getApiBaseUrl());
  console.log("上传地址:", getUploadUrl());
  console.log("WS 地址:", getWsUrl());
  console.log("Mock 数据:", useMock() ? "启用" : "禁用");
  console.log("代理模式:", useProxy() ? "启用" : "禁用");
  console.log("开发工具:", showDevTools() ? "显示" : "隐藏");
  console.log("=".repeat(50));
}

/**
 * 获取完整的环境变量对象
 */
export function getEnvConfig() {
  return {
    env: getEnv(),
    isDev: isDev(),
    isProd: isProd(),
    isLocal: isLocal(),
    apiBaseUrl: getApiBaseUrl(),
    uploadUrl: getUploadUrl(),
    wsUrl: getWsUrl(),
    appTitle: getAppTitle(),
    appVersion: getAppVersion(),
    useMock: useMock(),
    useProxy: useProxy(),
    showDevTools: showDevTools(),
    useVConsole: useVConsole(),
  };
}
