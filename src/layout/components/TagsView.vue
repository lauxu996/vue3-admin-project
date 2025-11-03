<template>
  <div class="tags-view-container">
    <el-scrollbar class="tags-view-wrapper" ref="scrollbarRef">
      <div class="tags-view-content">
        <router-link
          v-for="tag in visitedViews"
          :key="tag.path"
          :class="isActive(tag) ? 'active' : ''"
          :to="{ path: tag.path, query: tag.query }"
          class="tags-view-item"
          @contextmenu.prevent="openMenu(tag, $event)"
        >
          {{ tag.title }}
          <el-icon
            v-if="!tag.affix"
            class="el-icon-close"
            @click.prevent.stop="closeSelectedTag(tag)"
          >
            <Close />
          </el-icon>
        </router-link>
      </div>
    </el-scrollbar>

    <ul
      v-show="visible"
      :style="{ left: left + 'px', top: top + 'px' }"
      class="contextmenu"
    >
      <li @click="refreshSelectedTag(selectedTag)">刷新</li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">关闭</li>
      <li @click="closeOthersTags">关闭其他</li>
      <li @click="closeAllTags">关闭所有</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTagsViewStore, type TagView } from '@/store/modules/tagsView'

const route = useRoute()
const router = useRouter()
const tagsViewStore = useTagsViewStore()

const visible = ref(false)
const top = ref(0)
const left = ref(0)
const selectedTag = ref<TagView>({} as TagView)
const scrollbarRef = ref()

const visitedViews = computed(() => tagsViewStore.visitedViews)

const isActive = (tag: TagView) => {
  return tag.path === route.path
}

const isAffix = (tag: TagView) => {
  return tag.affix
}

const addTags = () => {
  if (route.name) {
    tagsViewStore.addVisitedView(route)
    tagsViewStore.addCachedView(route)
  }
}

const closeSelectedTag = (view: TagView) => {
  tagsViewStore.delVisitedView(view)
  tagsViewStore.delCachedView(view)
  if (isActive(view)) {
    toLastView(tagsViewStore.visitedViews, view)
  }
}

const closeOthersTags = () => {
  router.push(selectedTag.value)
  tagsViewStore.delOthersVisitedViews(selectedTag.value)
  tagsViewStore.delOthersCachedViews(selectedTag.value)
}

const closeAllTags = () => {
  tagsViewStore.delAllVisitedViews()
  tagsViewStore.delAllCachedViews()
  toLastView(tagsViewStore.visitedViews, selectedTag.value)
}

const refreshSelectedTag = (view: TagView) => {
  tagsViewStore.delCachedView(view)
  nextTick(() => {
    router.replace({
      path: '/redirect' + view.path,
      query: view.query
    })
  })
}

const toLastView = (visitedViews: TagView[], _view: TagView) => {
  const latestView = visitedViews.slice(-1)[0]
  if (latestView) {
    router.push(latestView.fullPath)
  } else {
    router.push('/')
  }
}

const openMenu = (tag: TagView, e: MouseEvent) => {
  const menuMinWidth = 105
  const offsetLeft = scrollbarRef.value.$el.getBoundingClientRect().left
  const offsetWidth = scrollbarRef.value.$el.offsetWidth
  const maxLeft = offsetWidth - menuMinWidth
  const l = e.clientX - offsetLeft + 15

  if (l > maxLeft) {
    left.value = maxLeft
  } else {
    left.value = l
  }

  top.value = e.clientY
  visible.value = true
  selectedTag.value = tag
}

const closeMenu = () => {
  visible.value = false
}

watch(
  () => route.path,
  () => {
    addTags()
  },
  { immediate: true }
)

watch(visible, (value) => {
  if (value) {
    document.body.addEventListener('click', closeMenu)
  } else {
    document.body.removeEventListener('click', closeMenu)
  }
})
</script>

<style scoped lang="scss">
.tags-view-container {
  height: 34px;
  width: 100%;
  background: var(--navbar-bg);
  border-bottom: 1px solid var(--border-color);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  transition: background-color 0.3s;

  .tags-view-wrapper {
    height: 100%;

    .tags-view-content {
      display: inline-flex;
      padding: 0 10px;
    }

    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      border: 1px solid var(--border-color);
      color: var(--text-color);
      background: var(--navbar-bg);
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;
      transition: all 0.3s;

      &:first-of-type {
        margin-left: 0;
      }

      &:hover {
        color: #409eff;
      }

      &.active {
        background-color: #409eff;
        color: #fff;
        border-color: #409eff;

        &::before {
          content: '';
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 4px;
        }
      }

      .el-icon-close {
        width: 16px;
        height: 16px;
        vertical-align: 2px;
        border-radius: 50%;
        text-align: center;
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        transform-origin: 100% 50%;
        margin-left: 4px;

        &:hover {
          background-color: #b4bccc;
          color: #fff;
        }
      }
    }
  }

  .contextmenu {
    margin: 0;
    background: var(--navbar-bg);
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: var(--text-color);
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    transition: background-color 0.3s;

    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;

      &:hover {
        background: rgba(64, 158, 255, 0.1);
      }
    }
  }
}
</style>
