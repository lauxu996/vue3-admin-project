/// <reference types="vite/client" />

// 声明 Vue 组件模块
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// 声明样式文件模块
declare module "*.css" {
  const content: Record<string, string>;
  export default content;
}

declare module "*.scss" {
  const content: Record<string, string>;
  export default content;
}

declare module "*.sass" {
  const content: Record<string, string>;
  export default content;
}

declare module "*.less" {
  const content: Record<string, string>;
  export default content;
}

interface ImportMetaEnv {
  // 环境标识
  readonly VITE_ENV: "local" | "dev" | "test" | "stage" | "prod";

  // 应用配置
  readonly VITE_APP_TITLE: string;
  readonly VITE_APP_VERSION: string;

  // API 配置
  readonly VITE_API_BASE_URL: string;
  readonly VITE_UPLOAD_URL: string;
  readonly VITE_WS_URL: string;

  // 功能开关
  readonly VITE_USE_MOCK: string;
  readonly VITE_USE_PROXY: string;
  readonly VITE_SHOW_DEV_TOOLS: string;
  readonly VITE_USE_VCONSOLE: string;
  readonly VITE_BUILD_DROP_CONSOLE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
