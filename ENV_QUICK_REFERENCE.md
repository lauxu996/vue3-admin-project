# 环境变量快速参考

## 📋 环境文件列表

```
.env              # 所有环境公共配置 ✅ 提交到 Git
.env.local        # 本地开发环境 ❌ 不提交（个人配置）
.env.dev          # 开发环境 ✅ 提交到 Git
.env.test         # 测试环境 ✅ 提交到 Git
.env.stage        # 预发布环境 ✅ 提交到 Git
.env.prod         # 生产环境 ✅ 提交到 Git
```

## 🚀 快速开始

### 1. 初次使用
```bash
# 复制配置模板
cp .env.local.example .env.local

# 编辑配置（修改 API 地址等）
# 然后启动项目
pnpm dev
```

### 2. 常用命令
```bash
pnpm dev              # 本地开发（使用 .env.local）
pnpm dev-server       # 开发环境（使用 .env.dev）
pnpm build:dev        # 构建开发环境
pnpm build:test       # 构建测试环境
pnpm build:stage      # 构建预发布环境
pnpm build:prod       # 构建生产环境
```

## 🔑 常用环境变量

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `VITE_ENV` | 环境标识 | `local`, `dev`, `prod` |
| `VITE_API_BASE_URL` | API 基础路径 | `http://localhost:8080/api` |
| `VITE_USE_MOCK` | 启用 Mock | `true` / `false` |
| `VITE_USE_PROXY` | 启用代理 | `true` / `false` |

## 💻 代码中使用

### 方式一：直接使用
```typescript
const apiUrl = import.meta.env.VITE_API_BASE_URL
const env = import.meta.env.VITE_ENV
```

### 方式二：使用工具函数（推荐）
```typescript
import { getApiBaseUrl, isDev, getEnvConfig } from '@/utils/env'

// 获取 API 地址
const apiUrl = getApiBaseUrl()

// 判断环境
if (isDev()) {
  console.log('开发环境')
}

// 获取完整配置
const config = getEnvConfig()
```

## 🔍 查看环境配置

### 方法一：查看页面
登录系统 → **系统管理** → **环境配置**

### 方法二：控制台
开发环境启动时会自动打印环境信息

### 方法三：代码调用
```typescript
import { printEnvInfo } from '@/utils/env'
printEnvInfo()
```

## ⚠️ 注意事项

1. **必须以 VITE_ 开头**
   ```env
   ✅ VITE_API_URL=xxx
   ❌ API_URL=xxx
   ```

2. **修改后需重启**
   修改环境变量后，必须重启开发服务器

3. **都是字符串类型**
   ```typescript
   ❌ if (import.meta.env.VITE_USE_MOCK)
   ✅ if (import.meta.env.VITE_USE_MOCK === 'true')
   ```

4. **不要存储敏感信息**
   ❌ 不要在环境变量中存储密钥、密码等

## 📚 详细文档

查看 [ENV_VARIABLES_GUIDE.md](./ENV_VARIABLES_GUIDE.md) 了解更多详情
