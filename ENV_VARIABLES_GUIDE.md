# 环境变量配置说明

## 📁 环境变量文件

项目中包含以下环境变量配置文件：

| 文件 | 说明 | 是否提交到 Git |
|------|------|----------------|
| `.env` | 所有环境的公共配置 | ✅ 是 |
| `.env.local` | 本地开发环境（个人配置） | ❌ 否 |
| `.env.dev` | 开发环境 | ✅ 是 |
| `.env.test` | 测试环境 | ✅ 是 |
| `.env.stage` | 预发布环境 | ✅ 是 |
| `.env.prod` | 生产环境 | ✅ 是 |

## 🔧 环境变量说明

### 基础配置

#### VITE_ENV
- **说明**：环境标识
- **类型**：`'local' | 'dev' | 'test' | 'stage' | 'prod'`
- **示例**：`VITE_ENV=local`

#### VITE_APP_TITLE
- **说明**：应用标题，显示在浏览器标题栏
- **类型**：`string`
- **示例**：`VITE_APP_TITLE=后台管理系统`

#### VITE_APP_VERSION
- **说明**：应用版本号
- **类型**：`string`
- **示例**：`VITE_APP_VERSION=1.0.0`

### API 配置

#### VITE_API_BASE_URL
- **说明**：API 基础路径
- **类型**：`string`
- **示例**：`VITE_API_BASE_URL=http://localhost:8080/api`

#### VITE_UPLOAD_URL
- **说明**：文件上传地址
- **类型**：`string`
- **示例**：`VITE_UPLOAD_URL=http://localhost:8080/api/upload`

#### VITE_WS_URL
- **说明**：WebSocket 连接地址
- **类型**：`string`
- **示例**：`VITE_WS_URL=ws://localhost:8080/ws`

### 功能开关

#### VITE_USE_MOCK
- **说明**：是否启用 Mock 数据
- **类型**：`'true' | 'false'`
- **示例**：`VITE_USE_MOCK=true`

#### VITE_USE_PROXY
- **说明**：是否开启代理
- **类型**：`'true' | 'false'`
- **示例**：`VITE_USE_PROXY=true`

#### VITE_SHOW_DEV_TOOLS
- **说明**：是否显示开发工具
- **类型**：`'true' | 'false'`
- **示例**：`VITE_SHOW_DEV_TOOLS=true`

#### VITE_USE_VCONSOLE
- **说明**：是否开启 vconsole（移动端调试）
- **类型**：`'true' | 'false'`
- **示例**：`VITE_USE_VCONSOLE=false`

#### VITE_BUILD_DROP_CONSOLE
- **说明**：生产环境是否移除 console
- **类型**：`'true' | 'false'`
- **示例**：`VITE_BUILD_DROP_CONSOLE=true`

## 🚀 使用方法

### 1. 在代码中使用

```typescript
// 直接使用
const apiUrl = import.meta.env.VITE_API_BASE_URL
const appTitle = import.meta.env.VITE_APP_TITLE

// 判断环境
const isDev = import.meta.env.VITE_ENV === 'dev'
const isProd = import.meta.env.VITE_ENV === 'prod'

// 使用布尔值（注意：环境变量都是字符串）
const useMock = import.meta.env.VITE_USE_MOCK === 'true'
```

### 2. TypeScript 类型支持

所有环境变量都有完整的类型定义，在 `src/env.d.ts` 中：

```typescript
interface ImportMetaEnv {
  readonly VITE_ENV: 'local' | 'dev' | 'test' | 'stage' | 'prod'
  readonly VITE_APP_TITLE: string
  readonly VITE_API_BASE_URL: string
  // ... 更多类型定义
}
```

编辑器会提供自动补全和类型检查。

### 3. 在组件中使用

```vue
<script setup lang="ts">
// 获取环境变量
const env = import.meta.env.VITE_ENV
const apiUrl = import.meta.env.VITE_API_BASE_URL

console.log('当前环境:', env)
console.log('API 地址:', apiUrl)
</script>
```

## 📝 不同环境的启动命令

### 本地开发
```bash
pnpm dev
# 或
pnpm dev --mode env.local
```
自动加载 `.env` 和 `.env.local` 文件

### 开发环境
```bash
pnpm dev-server
# 或
vite --mode dev
```
加载 `.env` 和 `.env.dev` 文件

### 测试环境构建
```bash
pnpm build:test
```
加载 `.env` 和 `.env.test` 文件

### 预发布环境构建
```bash
pnpm build:stage
```
加载 `.env` 和 `.env.stage` 文件

### 生产环境构建
```bash
pnpm build:prod
```
加载 `.env` 和 `.env.prod` 文件

## ⚙️ 环境变量加载优先级

Vite 按以下顺序加载环境变量文件（后面的会覆盖前面的）：

1. `.env` - 所有环境都会加载
2. `.env.local` - 所有环境都会加载，但会被 git 忽略
3. `.env.[mode]` - 指定模式的配置
4. `.env.[mode].local` - 指定模式的本地配置，会被 git 忽略

## 🔒 安全建议

### 1. 敏感信息保护
- ❌ **不要**在环境变量中存储密钥、密码等敏感信息
- ✅ **应该**使用后端接口获取敏感配置
- ✅ **应该**将 `.env.local` 添加到 `.gitignore`

### 2. 示例配置
在项目中可以提供 `.env.local.example` 文件作为模板：

```bash
# 复制示例文件
cp .env.local.example .env.local

# 然后修改 .env.local 中的配置
```

### 3. 团队协作
- 每个开发者可以有自己的 `.env.local` 配置
- 不要提交个人的 `.env.local` 文件到代码仓库
- 在文档中说明需要配置哪些环境变量

## 📋 配置检查清单

在部署前，请检查：

- [ ] `.env` 文件中的公共配置是否正确
- [ ] 对应环境的 `.env.[mode]` 文件是否配置正确
- [ ] API 地址是否正确
- [ ] WebSocket 地址是否正确（如果使用）
- [ ] 上传地址是否正确（如果使用）
- [ ] 生产环境是否关闭了开发工具
- [ ] 生产环境是否关闭了 Mock 数据

## 🆕 添加新的环境变量

### 1. 在环境文件中添加
```bash
# .env.local
VITE_NEW_CONFIG=your_value
```

### 2. 更新 TypeScript 类型定义
在 `src/env.d.ts` 中添加：
```typescript
interface ImportMetaEnv {
  readonly VITE_NEW_CONFIG: string
}
```

### 3. 在代码中使用
```typescript
const newConfig = import.meta.env.VITE_NEW_CONFIG
```

## 🐛 常见问题

### Q1: 修改环境变量后不生效？
**A**: 需要重启开发服务器，Vite 在启动时读取环境变量。

### Q2: 环境变量值总是 undefined？
**A**: 检查：
1. 变量名是否以 `VITE_` 开头（Vite 要求）
2. 是否重启了开发服务器
3. 文件名和模式是否匹配

### Q3: 如何在构建时使用不同的环境变量？
**A**: 使用 `--mode` 参数：
```bash
vite build --mode dev    # 使用 .env.dev
vite build --mode prod   # 使用 .env.prod
```

### Q4: 可以在环境变量中使用其他环境变量吗？
**A**: 不可以直接引用，Vite 不支持变量替换。如需要，可以在代码中组合。

## 📚 参考资料

- [Vite 环境变量和模式](https://cn.vitejs.dev/guide/env-and-mode.html)
- [环境变量最佳实践](https://12factor.net/zh_cn/config)

---

**最后更新**: 2025-10-24
