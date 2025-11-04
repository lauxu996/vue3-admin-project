<template>
  <div v-if="!item.meta?.hidden">
    <!-- 只有一个子路由且不强制显示父级 -->
    <template
      v-if="
        hasOneShowingChild(item.children, item) &&
        (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
        !item.meta?.alwaysShow
      "
    >
      <el-menu-item :index="resolvePath(onlyOneChild.path)">
        <el-icon v-if="onlyOneChild.meta?.icon">
          <component :is="onlyOneChild.meta.icon" />
        </el-icon>
        <template #title>
          <span>{{ onlyOneChild.meta?.title }}</span>
        </template>
      </el-menu-item>
    </template>

    <!-- 多个子路由 -->
    <el-sub-menu v-else :index="resolvePath(item.path)">
      <template #title>
        <el-icon v-if="item.meta?.icon">
          <component :is="item.meta.icon" />
        </el-icon>
        <span>{{ item.meta?.title }}</span>
      </template>

      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :item="child"
        :base-path="resolvePath(child.path)"
      />
    </el-sub-menu>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { AppRouteRecordRaw } from "@/types/router";

interface Props {
  item: AppRouteRecordRaw;
  basePath: string;
}

const props = defineProps<Props>();

const onlyOneChild = ref<any>(null);

const hasOneShowingChild = (
  children: AppRouteRecordRaw[] = [],
  parent: AppRouteRecordRaw
) => {
  const showingChildren = children.filter((item) => {
    if (item.meta?.hidden) {
      return false;
    } else {
      onlyOneChild.value = item;
      return true;
    }
  });

  if (showingChildren.length === 1) {
    return true;
  }

  if (showingChildren.length === 0) {
    onlyOneChild.value = { ...parent, path: "", noShowingChildren: true };
    return true;
  }

  return false;
};

const resolvePath = (routePath: string) => {
  // 如果是外链，直接返回
  if (/^https?:\/\//.test(routePath)) {
    return routePath;
  }
  // 如果基础路径是外链，直接返回
  if (/^https?:\/\//.test(props.basePath)) {
    return props.basePath;
  }
  // 如果子路由是绝对路径，直接返回
  if (routePath.startsWith("/")) {
    return routePath;
  }
  // 如果 routePath 为空（父路由的情况）
  if (!routePath || routePath === "") {
    return props.basePath;
  }
  // 否则拼接路径
  const basePath = props.basePath.endsWith("/")
    ? props.basePath
    : props.basePath + "/";
  const finalPath = basePath + routePath;
  return finalPath;
};
</script>
