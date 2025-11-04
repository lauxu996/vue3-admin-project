/**
 * 权限状态管理
 */
import { defineStore } from "pinia";
import { ref } from "vue";
import type { AppRouteRecordRaw } from "@/types/router";

export const usePermissionStore = defineStore(
  "permission",
  () => {
    // 状态
    const routes = ref<AppRouteRecordRaw[]>([]);
    const addRoutes = ref<AppRouteRecordRaw[]>([]);
    const isRoutesGenerated = ref(false);

    // 设置路由
    const setRoutes = (newRoutes: AppRouteRecordRaw[]) => {
      routes.value = newRoutes;
      isRoutesGenerated.value = true;
    };

    // 设置动态添加的路由
    const setAddRoutes = (newRoutes: AppRouteRecordRaw[]) => {
      addRoutes.value = newRoutes;
    };

    // 重置
    const reset = () => {
      routes.value = [];
      addRoutes.value = [];
      isRoutesGenerated.value = false;
    };

    return {
      routes,
      addRoutes,
      isRoutesGenerated,
      setRoutes,
      setAddRoutes,
      reset,
    };
  },
  {
    // 持久化配置
    persist: {
      key: "permission-store",
      storage: localStorage,
      paths: ["isRoutesGenerated"], // 只持久化标志位，不持久化 routes（因为 component 函数无法序列化）
    },
  }
);
