<template>
  <div class="token-test-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>Token 无感刷新功能测试</span>
        </div>
      </template>

      <el-space direction="vertical" :size="20" style="width: 100%">
        <!-- Token 信息显示 -->
        <el-alert title="Token 信息" type="info" :closable="false">
          <div class="token-info">
            <p><strong>Access Token:</strong></p>
            <el-input
              v-model="tokenInfo.accessToken"
              type="textarea"
              :rows="3"
              readonly
              placeholder="暂无 Token"
            />
            <p style="margin-top: 10px"><strong>Refresh Token:</strong></p>
            <el-input
              v-model="tokenInfo.refreshToken"
              type="textarea"
              :rows="3"
              readonly
              placeholder="暂无 Refresh Token"
            />
          </div>
        </el-alert>

        <!-- 测试按钮 -->
        <el-row :gutter="20">
          <el-col :span="6">
            <el-button
              type="primary"
              @click="testNormalRequest"
              :loading="loading.normal"
            >
              测试正常请求
            </el-button>
          </el-col>
          <el-col :span="6">
            <el-button
              type="warning"
              @click="simulateTokenExpired"
              :loading="loading.expire"
            >
              模拟 Token 过期
            </el-button>
          </el-col>
          <el-col :span="6">
            <el-button
              type="success"
              @click="testConcurrentRequests"
              :loading="loading.concurrent"
            >
              测试并发请求
            </el-button>
          </el-col>
          <el-col :span="6">
            <el-button type="danger" @click="clearAllTokens">
              清除所有 Token
            </el-button>
          </el-col>
        </el-row>

        <!-- 请求日志 -->
        <el-card>
          <template #header>
            <div class="card-header">
              <span>请求日志</span>
              <el-button type="text" @click="clearLogs">清空日志</el-button>
            </div>
          </template>
          <div class="logs-container">
            <div v-if="logs.length === 0" class="no-logs">暂无日志记录</div>
            <div v-else>
              <div
                v-for="(log, index) in logs"
                :key="index"
                class="log-item"
                :class="log.type"
              >
                <span class="log-time">{{ log.time }}</span>
                <span class="log-type">{{ log.type.toUpperCase() }}</span>
                <span class="log-message">{{ log.message }}</span>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 使用说明 -->
        <el-alert title="使用说明" type="success" :closable="false">
          <ul>
            <li>
              <strong>测试正常请求</strong>：发送一个正常的 API 请求，如果 Token
              有效则正常返回
            </li>
            <li>
              <strong>模拟 Token 过期</strong>：手动将 Token
              设置为无效值，下次请求时会自动触发刷新
            </li>
            <li>
              <strong>测试并发请求</strong>：同时发送多个请求，验证只会触发一次
              Token 刷新
            </li>
            <li>
              <strong>清除所有 Token</strong>：清空 localStorage 中的所有
              Token，用于测试未登录状态
            </li>
          </ul>
        </el-alert>
      </el-space>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/store/modules/user";
import {
  getToken,
  getRefreshToken,
  setToken,
  clearAuth,
} from "@/utils/storage";
import { getUserList } from "@/api/example";

const userStore = useUserStore();

// Token 信息
const tokenInfo = ref({
  accessToken: "",
  refreshToken: "",
});

// 加载状态
const loading = ref({
  normal: false,
  expire: false,
  concurrent: false,
});

// 日志记录
interface Log {
  time: string;
  type: "info" | "success" | "warning" | "error";
  message: string;
}

const logs = ref<Log[]>([]);

// 添加日志
const addLog = (type: Log["type"], message: string) => {
  const now = new Date();
  const time = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
  logs.value.unshift({ time, type, message });
  // 只保留最近 50 条日志
  if (logs.value.length > 50) {
    logs.value = logs.value.slice(0, 50);
  }
};

// 清空日志
const clearLogs = () => {
  logs.value = [];
};

// 更新 Token 显示
const updateTokenInfo = () => {
  tokenInfo.value.accessToken = getToken() || "暂无 Token";
  tokenInfo.value.refreshToken = getRefreshToken() || "暂无 Refresh Token";
};

// 测试正常请求
const testNormalRequest = async () => {
  loading.value.normal = true;
  addLog("info", "发送正常请求...");

  try {
    const res = await getUserList();
    addLog("success", `请求成功：${JSON.stringify(res)}`);
    ElMessage.success("请求成功");
  } catch (error: any) {
    addLog("error", `请求失败：${error.message || "未知错误"}`);
    ElMessage.error("请求失败");
  } finally {
    loading.value.normal = false;
  }
};

// 模拟 Token 过期
const simulateTokenExpired = () => {
  loading.value.expire = true;

  try {
    // 设置一个无效的 Token
    const invalidToken = "invalid-token-" + Date.now();
    setToken(invalidToken);
    userStore.setToken(invalidToken);
    updateTokenInfo();

    addLog("warning", "Token 已设置为无效值，下次请求时会自动刷新");
    ElMessage.warning(
      'Token 已设置为无效，请点击"测试正常请求"查看自动刷新效果'
    );
  } catch (error: any) {
    addLog("error", `操作失败：${error.message}`);
    ElMessage.error("操作失败");
  } finally {
    loading.value.expire = false;
  }
};

// 测试并发请求
const testConcurrentRequests = async () => {
  loading.value.concurrent = true;
  addLog("info", "发送 5 个并发请求...");

  try {
    // 先模拟 Token 过期
    const invalidToken = "invalid-token-" + Date.now();
    setToken(invalidToken);
    userStore.setToken(invalidToken);
    updateTokenInfo();
    addLog("warning", "Token 已设置为无效值");

    // 同时发送 5 个请求
    const promises = [];
    for (let i = 1; i <= 5; i++) {
      addLog("info", `发送第 ${i} 个请求...`);
      promises.push(
        getUserList()
          .then(() => {
            addLog("success", `第 ${i} 个请求成功`);
          })
          .catch((error) => {
            addLog("error", `第 ${i} 个请求失败：${error.message}`);
          })
      );
    }

    await Promise.allSettled(promises);
    addLog("info", "所有请求已完成，请查看日志了解详情");
    ElMessage.info("并发请求测试完成，请查看日志");

    updateTokenInfo();
  } catch (error: any) {
    addLog("error", `测试失败：${error.message}`);
    ElMessage.error("测试失败");
  } finally {
    loading.value.concurrent = false;
  }
};

// 清除所有 Token
const clearAllTokens = () => {
  clearAuth();
  userStore.logout();
  updateTokenInfo();
  addLog("warning", "所有 Token 已清除");
  ElMessage.warning("所有 Token 已清除");
};

// 页面加载时更新 Token 信息
onMounted(() => {
  updateTokenInfo();
  addLog("info", "页面已加载");
});
</script>

<style scoped lang="scss">
.token-test-container {
  padding: 20px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .token-info {
    p {
      margin: 10px 0 5px;
    }
  }

  .logs-container {
    max-height: 400px;
    overflow-y: auto;

    .no-logs {
      text-align: center;
      color: #999;
      padding: 20px;
    }

    .log-item {
      padding: 8px 12px;
      margin-bottom: 8px;
      border-radius: 4px;
      display: flex;
      gap: 12px;
      font-size: 13px;

      &.info {
        background: #f4f4f5;
        color: #606266;
      }

      &.success {
        background: #f0f9ff;
        color: #67c23a;
      }

      &.warning {
        background: #fdf6ec;
        color: #e6a23c;
      }

      &.error {
        background: #fef0f0;
        color: #f56c6c;
      }

      .log-time {
        color: #909399;
        font-family: monospace;
        min-width: 60px;
      }

      .log-type {
        font-weight: bold;
        min-width: 60px;
      }

      .log-message {
        flex: 1;
        word-break: break-all;
      }
    }
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
  }
}
</style>
