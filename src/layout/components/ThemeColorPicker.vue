<template>
  <el-dropdown trigger="click" placement="bottom">
    <span class="dropdown-trigger">
      <el-tooltip content="主题换肤" placement="bottom">
        <el-icon class="theme-color-picker">
          <Brush />
        </el-icon>
      </el-tooltip>
    </span>

    <template #dropdown>
      <div class="theme-picker-content">
        <div class="theme-picker-title">选择主题颜色</div>
        <div class="theme-colors">
          <div
            v-for="color in themeColors"
            :key="color.name"
            class="color-item"
            :class="{ active: themeColor === color.name }"
            :style="{ backgroundColor: color.value }"
            @click="handleColorChange(color.name)"
            :title="color.label"
          >
            <el-icon v-if="themeColor === color.name" class="check-icon">
              <Check />
            </el-icon>
          </div>
        </div>
        
        <el-divider style="margin: 12px 0" />
        
        <div class="theme-picker-title">文字颜色预览</div>
        <div class="text-preview">
          <div class="preview-item primary-text" :style="{ color: getCurrentThemeColor(), backgroundColor: getCurrentThemeColorLighter() }">
            主题色文字
          </div>
          <div class="preview-item normal-text">默认文字</div>
          <div class="preview-item secondary-text">次要文字</div>
        </div>
      </div>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Brush, Check } from '@element-plus/icons-vue'
import { useAppStore } from '@/store/modules/app'

type ThemeColorType = 'blue' | 'green' | 'purple' | 'orange' | 'red'

const appStore = useAppStore()
const themeColor = computed(() => appStore.themeColor)

const themeColors: Array<{ name: ThemeColorType; value: string; label: string }> = [
  { name: 'blue', value: '#409eff', label: '蓝色' },
  { name: 'green', value: '#67c23a', label: '绿色' },
  { name: 'purple', value: '#9c27b0', label: '紫色' },
  { name: 'orange', value: '#ff9800', label: '橙色' },
  { name: 'red', value: '#f56c6c', label: '红色' }
]

const handleColorChange = (colorName: ThemeColorType) => {
  appStore.setThemeColor(colorName)
}

// 获取当前主题色
const getCurrentThemeColor = () => {
  const colorMap: Record<ThemeColorType, string> = {
    blue: '#409eff',
    green: '#67c23a',
    purple: '#9c27b0',
    orange: '#ff9800',
    red: '#f56c6c'
  }
  return colorMap[themeColor.value]
}

// 获取当前主题浅色
const getCurrentThemeColorLighter = () => {
  const colorMap: Record<ThemeColorType, string> = {
    blue: '#a0cfff',
    green: '#b3e19d',
    purple: '#ce93d8',
    orange: '#ffcc80',
    red: '#fab6b6'
  }
  return colorMap[themeColor.value]
}
</script>

<style scoped lang="scss">
.dropdown-trigger {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}

.theme-color-picker {
  font-size: 20px;
  cursor: pointer;
  color: var(--text-color-secondary);
  transition: all 0.3s;

  &:hover {
    color: var(--theme-color);
    transform: rotate(90deg);
  }
}

.theme-picker-content {
  padding: 12px;
  min-width: 240px;

  .theme-picker-title {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-color);
    margin-bottom: 10px;
  }

  .theme-colors {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 10px;
    margin-bottom: 8px;

    .color-item {
      width: 36px;
      height: 36px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      border: 2px solid transparent;

      &:hover {
        transform: scale(1.15);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      }

      &.active {
        border: 2px solid #fff;
        box-shadow: 0 0 0 2px currentColor;
        transform: scale(1.1);
      }

      .check-icon {
        color: #fff;
        font-size: 20px;
        font-weight: bold;
        filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
      }
    }
  }

  .text-preview {
    display: flex;
    flex-direction: column;
    gap: 6px;

    .preview-item {
      padding: 8px 10px;
      border-radius: 4px;
      font-size: 12px;
      transition: all 0.3s;

      &.primary-text {
        font-weight: 600;
      }

      &.normal-text {
        color: var(--text-color);
        background-color: var(--bg-color);
      }

      &.secondary-text {
        color: var(--text-color-secondary);
        background-color: var(--bg-color);
      }
    }
  }
}
</style>
