<template>
  <div class="system-role-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>角色管理</span>
          <el-button type="primary" @click="handleAdd">新增角色</el-button>
        </div>
      </template>

      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="角色名称" />
        <el-table-column prop="code" label="角色标识" />
        <el-table-column prop="description" label="描述" />
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
    name: '超级管理员',
    code: 'admin',
    description: '拥有所有权限',
    status: 1
  },
  {
    id: 2,
    name: '普通用户',
    code: 'user',
    description: '普通用户权限',
    status: 1
  }
])

const handleAdd = () => {
  ElMessage.info('新增角色功能待实现')
}

const handleEdit = (row: any) => {
  ElMessage.info(`编辑角色：${row.name}`)
}

const handleDelete = (row: any) => {
  ElMessage.info(`删除角色：${row.name}`)
}
</script>

<style scoped lang="scss">
.system-role-container {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
