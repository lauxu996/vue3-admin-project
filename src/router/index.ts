/**
 * Vue Router 配置
 */
import { createRouter, createWebHistory } from "vue-router";
import type { App } from "vue";
import { constantRoutes } from "./routes";

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes as any,
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

// 重置路由
export function resetRouter() {
  router.getRoutes().forEach((route) => {
    const { name } = route;
    if (name) {
      router.hasRoute(name) && router.removeRoute(name);
    }
  });
}

// 安装路由
export function setupRouter(app: App<Element>) {
  app.use(router);
}

export default router;
