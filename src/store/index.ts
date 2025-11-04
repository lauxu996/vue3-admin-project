/**
 * Pinia Store 入口文件
 */
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

export default pinia;

// 导出所有 store
export * from "./modules/app";
export * from "./modules/user";
export * from "./modules/permission";
export * from "./modules/tagsView";
