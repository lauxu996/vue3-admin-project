import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './store'
import { setupRouterGuard } from './router/guard'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import './style.css'

const app = createApp(App)

// 注册 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 安装插件
app.use(pinia)
app.use(router)
app.use(ElementPlus)

// 设置路由守卫
setupRouterGuard(router)

app.mount('#app')
