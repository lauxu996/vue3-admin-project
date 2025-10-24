<template>
  <div class="system-menu-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>菜单管理</span>
          <el-button type="primary" @click="handleAdd">新增菜单</el-button>
        </div>
      </template>

      <el-table :data="tableData" style="width: 100%" border row-key="id" default-expand-all>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="菜单名称" />
        <el-table-column prop="path" label="路径" />
        <el-table-column prop="icon" label="图标" />
        <el-table-column label="类型">
          <template #default="{ row }">
            <el-tag>{{ row.type === 1 ? '菜单' : '按钮' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const tableData = ref([
  {
    id: 1,
    title: '系统管理',
    path: '/system',
    icon: 'Setting',
    type: 1,
    status: 1,
    children: [
      {
        id: 2,
        title: '用户管理',
        path: '/system/user',
        icon: 'User',
        type: 1,
        status: 1
      },
      {
        id: 3,
        title: '角色管理',
        path: '/system/role',
        icon: 'UserFilled',
        type: 1,
        status: 1
      },
      {
        id: 4,
        title: '菜单管理',
        path: '/system/menu',
        icon: 'Menu',
        type: 1,
        status: 1
      }
    ]
  }
])

const handleAdd = () => {
  ElMessage.info('新增菜单功能待实现')
}

const handleEdit = (row: any) => {
  ElMessage.info(`编辑菜单：${row.title}`)
}

const handleDelete = (row: any) => {
  ElMessage.info(`删除菜单：${row.title}`)
}
</script>

<style scoped lang="scss">
.system-menu-container {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
