<template>
  <div class="login-container">
    <!-- 左上角公司 Logo -->
    <div class="company-logo">
      <el-icon :size="40" color="#fff">
        <Shop />
      </el-icon>
      <span class="company-name">病理诊断中心</span>
    </div>

    <div class="login-box">
      <div class="login-header">
        <h2>病理诊断中心系统平台</h2>
        <p>专业 专注 共享 共惠</p>
      </div>

      <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="login-form">
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            prefix-icon="User"
            size="large"
            clearable
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="Lock"
            size="large"
            show-password
            clearable
            @keyup.enter="handleLogin"
          />
        </el-form-item>

        <el-form-item>
          <el-button
            :loading="loading"
            type="primary"
            size="large"
            class="login-button"
            @click="handleLogin"
          >
            登 录
          </el-button>
        </el-form-item>
      </el-form>

      <div class="login-tips">
        <p>默认账号：admin / admin123</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { Shop } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/modules/user'
import { setToken } from '@/utils/storage'
import type { LoginParams } from '@/types/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const loginFormRef = ref<FormInstance>()
const loading = ref(false)

const loginForm = reactive<LoginParams>({
  username: 'admin',
  password: 'admin123'
})

const loginRules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const handleLogin = async () => {
  if (!loginFormRef.value) return

  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        // 模拟登录（实际项目中需要调用 API）
        // const res = await login(loginForm)
        // const { token, userInfo } = res.data

        // 模拟数据
        const mockToken = 'mock-token-' + Date.now()
        const mockUserInfo = {
          id: 1,
          username: loginForm.username,
          nickname: '管理员',
          avatar: '',
          email: 'admin@example.com',
          phone: '13800138000',
          roles: ['admin'],
          permissions: ['*:*:*']
        }

        // 保存 token
        setToken(mockToken)
        userStore.setToken(mockToken)
        userStore.setUserInfo(mockUserInfo)

        ElMessage.success('登录成功')

        // 跳转到首页或者重定向的页面
        const redirect = (route.query.redirect as string) || '/'
        await router.push(redirect)
      } catch (error) {
        console.error('登录失败:', error)
        ElMessage.error('登录失败，请检查用户名和密码')
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style scoped lang="scss">
.login-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.company-logo {
  position: absolute;
  top: 30px;
  left: 40px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.8;
  }

  .company-name {
    font-size: 20px;
    font-weight: bold;
    color: #fff;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
}

.login-box {
  width: 420px;
  padding: 40px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 40px;

  h2 {
    font-size: 28px;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
  }

  p {
    font-size: 14px;
    color: #999;
  }
}

.login-form {
  .el-form-item {
    margin-bottom: 24px;
  }

  .login-button {
    width: 100%;
    margin-top: 10px;
  }
}

.login-tips {
  text-align: center;
  margin-top: 20px;

  p {
    font-size: 12px;
    color: #999;
  }
}
</style>
