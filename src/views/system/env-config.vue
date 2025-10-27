<template>
  <div class="env-config-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>环境变量配置</span>
          <el-tag :type="envTagType">{{ envText }}</el-tag>
        </div>
      </template>

      <!-- 基础信息 -->
      <el-descriptions title="基础信息" :column="2" border>
        <el-descriptions-item label="应用标题">
          {{ envConfig.appTitle }}
        </el-descriptions-item>
        <el-descriptions-item label="应用版本">
          {{ envConfig.appVersion }}
        </el-descriptions-item>
        <el-descriptions-item label="当前环境">
          <el-tag :type="envTagType">{{ envConfig.env }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="运行模式">
          <el-tag :type="envConfig.isDev ? 'warning' : 'success'">
            {{ envConfig.isDev ? 'development' : 'production' }}
          </el-tag>
        </el-descriptions-item>
      </el-descriptions>

      <!-- API 配置 -->
      <el-descriptions title="API 配置" :column="1" border style="margin-top: 20px">
        <el-descriptions-item label="API 基础路径">
          <el-text>{{ envConfig.apiBaseUrl }}</el-text>
          <el-button
            type="primary"
            link
            size="small"
            @click="copyText(envConfig.apiBaseUrl)"
          >
            复制
          </el-button>
        </el-descriptions-item>
        <el-descriptions-item label="上传地址">
          <el-text>{{ envConfig.uploadUrl }}</el-text>
          <el-button
            type="primary"
            link
            size="small"
            @click="copyText(envConfig.uploadUrl)"
          >
            复制
          </el-button>
        </el-descriptions-item>
        <el-descriptions-item label="WebSocket 地址">
          <el-text>{{ envConfig.wsUrl }}</el-text>
          <el-button
            type="primary"
            link
            size="small"
            @click="copyText(envConfig.wsUrl)"
          >
            复制
          </el-button>
        </el-descriptions-item>
      </el-descriptions>

      <!-- 功能开关 -->
      <el-descriptions title="功能开关" :column="2" border style="margin-top: 20px">
        <el-descriptions-item label="Mock 数据">
          <el-tag :type="envConfig.useMock ? 'success' : 'info'">
            {{ envConfig.useMock ? '启用' : '禁用' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="代理模式">
          <el-tag :type="envConfig.useProxy ? 'success' : 'info'">
            {{ envConfig.useProxy ? '启用' : '禁用' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="开发工具">
          <el-tag :type="envConfig.showDevTools ? 'success' : 'info'">
            {{ envConfig.showDevTools ? '显示' : '隐藏' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="VConsole">
          <el-tag :type="envConfig.useVConsole ? 'success' : 'info'">
            {{ envConfig.useVConsole ? '启用' : '禁用' }}
          </el-tag>
        </el-descriptions-item>
      </el-descriptions>

      <!-- 原始环境变量 -->
      <el-collapse style="margin-top: 20px">
        <el-collapse-item title="查看所有原始环境变量" name="1">
          <el-table :data="envList" border>
            <el-table-column prop="key" label="变量名" width="300" />
            <el-table-column prop="value" label="值" show-overflow-tooltip />
            <el-table-column label="操作" width="100">
              <template #default="{ row }">
                <el-button type="primary" link size="small" @click="copyText(row.value)">
                  复制
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-collapse-item>
      </el-collapse>

      <!-- 使用说明 -->
      <el-alert
        title="使用说明"
        type="info"
        :closable="false"
        style="margin-top: 20px"
      >
        <ul>
          <li>环境变量在构建时会被静态替换，修改后需要重启开发服务器</li>
          <li>所有环境变量必须以 <code>VITE_</code> 开头才能被访问</li>
          <li>环境变量值都是字符串类型，需要手动转换布尔值</li>
          <li>不要在环境变量中存储敏感信息（如密钥、密码）</li>
          <li>详细文档请查看项目根目录的 <code>ENV_VARIABLES_GUIDE.md</code></li>
        </ul>
      </el-alert>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import { getEnvConfig } from '@/utils/env'

// 获取环境配置
const envConfig = getEnvConfig()

// 环境标签类型
const envTagType = computed(() => {
  const typeMap: Record<string, any> = {
    local: 'info',
    dev: 'warning',
    test: 'success',
    stage: 'danger',
    prod: ''
  }
  return typeMap[envConfig.env] || 'info'
})

// 环境文本
const envText = computed(() => {
  const textMap: Record<string, string> = {
    local: '本地环境',
    dev: '开发环境',
    test: '测试环境',
    stage: '预发布环境',
    prod: '生产环境'
  }
  return textMap[envConfig.env] || '未知环境'
})

// 环境变量列表
const envList = computed(() => {
  const env = import.meta.env
  return Object.keys(env)
    .filter((key) => key.startsWith('VITE_'))
    .map((key) => ({
      key,
      value: env[key] as string
    }))
})

// 复制文本
const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    ElMessage.success('复制成功')
  } catch (error) {
    // 降级方案
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    try {
      document.execCommand('copy')
      ElMessage.success('复制成功')
    } catch (err) {
      ElMessage.error('复制失败')
    }
    document.body.removeChild(textarea)
  }
}
</script>

<style scoped lang="scss">
.env-config-container {
  padding: 20px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  :deep(.el-alert__description) {
    ul {
      margin: 0;
      padding-left: 20px;

      li {
        margin: 5px 0;
        line-height: 1.8;
      }
    }

    code {
      background: #f5f7fa;
      padding: 2px 8px;
      border-radius: 4px;
      color: #409eff;
      font-family: 'Courier New', monospace;
    }
  }
}
</style>
