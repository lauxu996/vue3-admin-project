# 环境变量配置 - 更新日志

## 📅 2025-10-24 - v1.0.0

### ✨ 新增功能

#### 1. 完整的环境变量配置系统
- ✅ 支持多环境配置（本地、开发、测试、预发布、生产）
- ✅ 统一的配置管理
- ✅ TypeScript 类型支持
- ✅ 环境变量工具函数

#### 2. 环境配置文件
创建了以下环境配置文件：

| 文件 | 用途 | Git 提交 |
|------|------|----------|
| `.env` | 公共配置 | ✅ |
| `.env.local` | 本地开发 | ❌ |
| `.env.dev` | 开发环境 | ✅ |
| `.env.test` | 测试环境 | ✅ |
| `.env.stage` | 预发布环境 | ✅ |
| `.env.prod` | 生产环境 | ✅ |
| `.env.local.example` | 配置模板 | ✅ |

#### 3. 支持的环境变量

**基础配置**
- `VITE_ENV` - 环境标识
- `VITE_APP_TITLE` - 应用标题
- `VITE_APP_VERSION` - 应用版本

**API 配置**
- `VITE_API_BASE_URL` - API 基础路径
- `VITE_UPLOAD_URL` - 上传文件地址
- `VITE_WS_URL` - WebSocket 地址

**功能开关**
- `VITE_USE_MOCK` - 是否启用 Mock
- `VITE_USE_PROXY` - 是否开启代理
- `VITE_SHOW_DEV_TOOLS` - 是否显示开发工具
- `VITE_USE_VCONSOLE` - 是否开启 vconsole
- `VITE_BUILD_DROP_CONSOLE` - 生产环境是否移除 console

### 🔧 新增文件

#### 环境配置文件
```
.env                    # 公共配置
.env.local             # 本地开发配置
.env.dev               # 开发环境配置
.env.test              # 测试环境配置
.env.stage             # 预发布环境配置
.env.prod              # 生产环境配置
.env.local.example     # 配置模板
```

#### 工具函数
**src/utils/env.ts**
```typescript
// 环境判断
getEnv()              // 获取当前环境
isDev()               // 是否为开发环境
isProd()              // 是否为生产环境
isLocal()             // 是否为本地环境

// 配置获取
getApiBaseUrl()       // 获取 API 地址
getUploadUrl()        // 获取上传地址
getWsUrl()            // 获取 WebSocket 地址
getAppTitle()         // 获取应用标题
getAppVersion()       // 获取应用版本

// 功能开关
useMock()             // 是否启用 Mock
useProxy()            // 是否开启代理
showDevTools()        // 是否显示开发工具
useVConsole()         // 是否开启 vconsole

// 工具方法
printEnvInfo()        // 打印环境信息
getEnvConfig()        // 获取完整配置对象
```

#### 环境配置页面
**src/views/system/env-config.vue**
- 可视化查看所有环境变量
- 支持复制配置值
- 显示功能开关状态
- 使用说明和文档链接

#### 文档
- **ENV_VARIABLES_GUIDE.md** - 详细使用指南
- **ENV_QUICK_REFERENCE.md** - 快速参考文档
- **CHANGELOG_ENV.md** - 本文件

### 📝 修改的文件

#### src/env.d.ts
```diff
  interface ImportMetaEnv {
-   readonly VITE_API_BASE_URL: string
-   // 更多环境变量...
+   // 环境标识
+   readonly VITE_ENV: 'local' | 'dev' | 'test' | 'stage' | 'prod'
+   
+   // 应用配置
+   readonly VITE_APP_TITLE: string
+   readonly VITE_APP_VERSION: string
+   
+   // API 配置
+   readonly VITE_API_BASE_URL: string
+   readonly VITE_UPLOAD_URL: string
+   readonly VITE_WS_URL: string
+   
+   // 功能开关
+   readonly VITE_USE_MOCK: string
+   readonly VITE_USE_PROXY: string
+   readonly VITE_SHOW_DEV_TOOLS: string
+   readonly VITE_USE_VCONSOLE: string
+   readonly VITE_BUILD_DROP_CONSOLE: string
  }
```

#### src/main.ts
```diff
+ import { printEnvInfo, isDev } from '@/utils/env'

  // 设置路由守卫
  setupRouterGuard(router)

+ // 开发环境打印环境信息
+ if (isDev()) {
+   printEnvInfo()
+ }

  app.mount('#app')
```

#### src/utils/request.ts
```diff
+ import { getApiBaseUrl } from './env'

  const service: AxiosInstance = axios.create({
-   baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
+   baseURL: getApiBaseUrl(),
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  })
```

#### .gitignore
```diff
  node_modules
  dist
  dist-ssr
  *.local

+ # Environment variables
+ .env.local
+ .env.*.local
```

#### src/router/routes.ts
添加环境配置页面路由：
```typescript
{
  path: 'env-config',
  name: 'EnvConfig',
  component: () => import('@/views/system/env-config.vue'),
  meta: {
    title: '环境配置',
    icon: 'Setting',
    roles: ['admin']
  }
}
```

#### README.md
- 更新环境变量章节
- 添加文档链接

### 📋 使用示例

#### 1. 初始化配置
```bash
# 复制配置模板
cp .env.local.example .env.local

# 编辑配置
# 修改 VITE_API_BASE_URL 等配置项

# 启动项目
pnpm dev
```

#### 2. 在代码中使用
```typescript
// 方式一：直接使用
const apiUrl = import.meta.env.VITE_API_BASE_URL

// 方式二：使用工具函数（推荐）
import { getApiBaseUrl, isDev } from '@/utils/env'

const apiUrl = getApiBaseUrl()
if (isDev()) {
  console.log('开发环境')
}
```

#### 3. 查看环境配置
- 登录系统 → 系统管理 → 环境配置
- 或查看控制台启动信息

### 🎯 最佳实践

#### 1. 配置管理
✅ **推荐做法**
- 使用工具函数访问环境变量
- 为每个环境创建独立配置文件
- 配置模板文件提交到 Git
- 个人配置不提交（.env.local）

❌ **不推荐做法**
- 直接在代码中硬编码配置
- 将敏感信息存储在环境变量中
- 将个人配置提交到 Git

#### 2. 安全性
- ❌ 不要存储密钥、密码
- ❌ 不要提交 .env.local 文件
- ✅ 使用后端接口获取敏感配置
- ✅ 在 CI/CD 中注入环境变量

#### 3. 团队协作
- ✅ 提供 .env.local.example 模板
- ✅ 在文档中说明必需的环境变量
- ✅ 统一使用工具函数访问配置
- ✅ 定期更新环境配置文档

### 🔍 功能特点

1. **多环境支持**
   - 本地开发、开发、测试、预发布、生产
   - 每个环境独立配置
   - 灵活切换

2. **类型安全**
   - TypeScript 类型定义
   - 编辑器自动补全
   - 编译时类型检查

3. **工具函数**
   - 统一的访问接口
   - 类型自动转换
   - 环境判断函数

4. **可视化管理**
   - 环境配置查看页面
   - 快速复制配置值
   - 功能开关状态展示

5. **完善的文档**
   - 详细使用指南
   - 快速参考手册
   - 最佳实践说明

### 📊 配置对照表

| 环境 | VITE_ENV | NODE_ENV | VITE_USE_MOCK | 说明 |
|------|----------|----------|---------------|------|
| 本地 | local | development | true | 本地开发，使用 Mock |
| 开发 | dev | development | false | 开发服务器 |
| 测试 | test | production | false | 测试服务器 |
| 预发布 | stage | production | false | 预发布服务器 |
| 生产 | prod | production | false | 生产服务器 |

### 🐛 已知问题

暂无

### 📋 待办事项

- [ ] 添加环境变量验证机制
- [ ] 支持运行时动态配置（可选）
- [ ] 添加配置加密功能（可选）

### 🙏 贡献者

- 开发者

### 📄 许可证

MIT

---

**版本**: 1.0.0  
**发布日期**: 2025-10-24  
**兼容性**: Vite 5.1+, Vue 3.5+, TypeScript 5.3+
