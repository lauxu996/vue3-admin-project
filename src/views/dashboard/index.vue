<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-blue">
              <el-icon :size="40" color="#fff">
                <User />
              </el-icon>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">用户数</div>
              <div class="card-panel-num">1,234</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card shadow="hover">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-green">
              <el-icon :size="40" color="#fff">
                <ShoppingCart />
              </el-icon>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">订单数</div>
              <div class="card-panel-num">5,678</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card shadow="hover">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-orange">
              <el-icon :size="40" color="#fff">
                <TrendCharts />
              </el-icon>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">销售额</div>
              <div class="card-panel-num">¥98,765</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card shadow="hover">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-red">
              <el-icon :size="40" color="#fff">
                <Message />
              </el-icon>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">消息数</div>
              <div class="card-panel-num">123</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>快速开始</span>
            </div>
          </template>
          <div class="welcome-content">
            <h2>欢迎使用后台管理系统！</h2>
            <p>
              这是一个基于 Vue 3 + TypeScript + Element Plus
              构建的后台管理系统模板。
            </p>
            <h3>功能特性：</h3>
            <ul>
              <li>✅ 登录/登出功能</li>
              <li>✅ 路由权限控制</li>
              <li>✅ 动态菜单生成</li>
              <li>✅ 标签页导航</li>
              <li>✅ 面包屑导航</li>
              <li>✅ Pinia 状态管理</li>
              <li>✅ Axios 请求封装</li>
              <li>✅ TypeScript 类型支持</li>
            </ul>
            <h3>如何新增页面：</h3>
            <ol>
              <li>在 <code>src/views</code> 目录下创建新的 Vue 文件</li>
              <li>
                在 <code>src/router/routes.ts</code> 的
                <code>asyncRoutes</code> 中添加路由配置
              </li>
              <li>根据需要设置路由的 meta 信息（title、icon、roles 等）</li>
              <li>刷新页面，新页面会自动显示在侧边栏菜单中</li>
            </ol>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
// 这里可以添加仪表板的逻辑
</script>

<style scoped lang="scss">
.dashboard-container {
  .card-panel {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;

    .card-panel-icon-wrapper {
      width: 80px;
      height: 80px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;

      &.icon-blue {
        background: var(--theme-color);
      }

      &.icon-green {
        background: #67c23a;
      }

      &.icon-orange {
        background: #e6a23c;
      }

      &.icon-red {
        background: #f56c6c;
      }
    }

    .card-panel-description {
      flex: 1;
      text-align: right;

      .card-panel-text {
        font-size: 16px;
        color: #666;
        margin-bottom: 10px;
      }

      .card-panel-num {
        font-size: 28px;
        font-weight: bold;
        color: #333;
      }
    }
  }

  .welcome-content {
    h2 {
      color: var(--theme-color);
      margin-bottom: 20px;
    }

    p {
      font-size: 16px;
      color: #666;
      margin-bottom: 20px;
    }

    h3 {
      color: #333;
      margin: 20px 0 10px;
    }

    ul,
    ol {
      padding-left: 20px;

      li {
        margin: 8px 0;
        color: #666;
        line-height: 1.8;
      }
    }

    code {
      background: #f5f7fa;
      padding: 2px 8px;
      border-radius: 4px;
      color: var(--theme-color);
      font-family: "Courier New", monospace;
    }
  }
}
</style>
