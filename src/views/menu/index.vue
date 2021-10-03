<template>
  <div class="menu">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button @click="$router.push({ name: 'menu-create' })">添加按钮</el-button>
      </div>
      <el-table :data="menus" style="width: 100%">
        <el-table-column type="index" label="编号" width="180"></el-table-column>
        <el-table-column prop="name" label="菜单名称"></el-table-column>
        <el-table-column prop="level" label="菜单级数"></el-table-column>
        <el-table-column prop="icon" label="前端图标"></el-table-column>
        <el-table-column prop="orderNum" label="排序"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getAllMenus, deleteMenu } from '@/services/menu'

export default Vue.extend({
  name: 'MenuIndex',
  data () {
    return {
      menus: []
    }
  },
  created () {
    this.loadAllMenus()
  },
  methods: {
    async loadAllMenus () {
      const { data } = await getAllMenus()
      console.log(data)
      if (data.code === '000000') {
        this.menus = data.data
      }
    },
    handleEdit (item: any) {
      this.$router.push({
        name: 'menu-edit',
        params: {
          id: item.id
        }
      })
    },
    handleDelete (item: any) {
      this.$confirm('确认删除吗？', '删除提示', {})
        .then(async () => {
          // 请求删除操作
          const { data } = await deleteMenu(item.id)
          console.log(data)
          if (data.code === '000000') {
            this.$message.success('删除成功')
            // 刷新列表
            this.loadAllMenus()
          } else if (data.code === '10000') { // 测试时只能删除无意义的菜单
            this.$message.info(data.mesg)
          }
        })
        .catch(err => { // 取消删除
          this.$message.info('已取消删除')
          console.log(err)
        })
    }
  }
})
</script>

<style lang="scss">
</style>
