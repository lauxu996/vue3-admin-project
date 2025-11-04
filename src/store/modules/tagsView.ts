/**
 * 标签页状态管理
 */
import { defineStore } from "pinia";
import { ref } from "vue";
import type { RouteLocationNormalizedLoaded } from "vue-router";

export interface TagView {
  name: string;
  path: string;
  title?: string;
  query?: any;
  params?: any;
  fullPath: string;
  affix?: boolean;
  meta?: any;
}

export const useTagsViewStore = defineStore("tagsView", () => {
  // 状态
  const visitedViews = ref<TagView[]>([]);
  const cachedViews = ref<string[]>([]);

  // 添加访问过的视图
  const addVisitedView = (view: RouteLocationNormalizedLoaded) => {
    if (visitedViews.value.some((v) => v.path === view.path)) {
      return;
    }
    visitedViews.value.push({
      name: view.name as string,
      path: view.path,
      title: (view.meta?.title as string) || "no-title",
      query: view.query,
      params: view.params,
      fullPath: view.fullPath,
      affix: (view.meta?.affix as boolean) || false,
      meta: view.meta,
    });
  };

  // 添加缓存视图
  const addCachedView = (view: RouteLocationNormalizedLoaded) => {
    if (view.meta?.noCache) {
      return;
    }
    if (cachedViews.value.includes(view.name as string)) {
      return;
    }
    cachedViews.value.push(view.name as string);
  };

  // 删除访问过的视图
  const delVisitedView = (view: TagView) => {
    const index = visitedViews.value.findIndex((v) => v.path === view.path);
    if (index > -1) {
      visitedViews.value.splice(index, 1);
    }
  };

  // 删除缓存视图
  const delCachedView = (view: TagView) => {
    const index = cachedViews.value.indexOf(view.name);
    if (index > -1) {
      cachedViews.value.splice(index, 1);
    }
  };

  // 删除其他访问过的视图
  const delOthersVisitedViews = (view: TagView) => {
    visitedViews.value = visitedViews.value.filter((v) => {
      return v.meta?.affix || v.path === view.path;
    });
  };

  // 删除其他缓存视图
  const delOthersCachedViews = (view: TagView) => {
    const index = cachedViews.value.indexOf(view.name);
    if (index > -1) {
      cachedViews.value = cachedViews.value.slice(index, index + 1);
    } else {
      cachedViews.value = [];
    }
  };

  // 删除所有访问过的视图
  const delAllVisitedViews = () => {
    visitedViews.value = visitedViews.value.filter((tag) => tag.meta?.affix);
  };

  // 删除所有缓存视图
  const delAllCachedViews = () => {
    cachedViews.value = [];
  };

  // 更新访问过的视图
  const updateVisitedView = (view: RouteLocationNormalizedLoaded) => {
    for (let v of visitedViews.value) {
      if (v.path === view.path) {
        v = Object.assign(v, view);
        break;
      }
    }
  };

  return {
    visitedViews,
    cachedViews,
    addVisitedView,
    addCachedView,
    delVisitedView,
    delCachedView,
    delOthersVisitedViews,
    delOthersCachedViews,
    delAllVisitedViews,
    delAllCachedViews,
    updateVisitedView,
  };
});
