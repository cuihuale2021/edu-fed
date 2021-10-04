<template>
    <div class="role-list">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <el-form :inline="true" :model="form" ref="form" class="demo-form-inline">
                    <el-form-item label="角色名称" prop="name">
                        <el-input v-model="form.name" placeholder="请输入角色名称"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" :diabled="isLoading" @click="onSubmit">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button :diabled="isLoading" @click="onReset">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-button>添加角色</el-button>
            <el-table :data="roles" style="width: 100%" v-loading="isLoading">
                <el-table-column type="index" label="编号" width="180"></el-table-column>
                <el-table-column prop="name" label="角色名称"></el-table-column>
                <el-table-column prop="code" label="角色编码"></el-table-column>
                <el-table-column prop="description" label="描述"></el-table-column>
                <el-table-column prop="createdTime" label="添加时间"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button @click="handleMenu(scope.row)" type="text" size="small">分配菜单</el-button>
                        <el-button type="text" size="small">分配资源</el-button>
                        <el-button type="text" size="small">编辑</el-button>
                        <el-button type="text" size="small" @click="delRole(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="form.current"
                :page-sizes="[5, 10, 15, 20]"
                :page-size="form.size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalCount"
                :diabled="isLoading"
            ></el-pagination>
        </el-card>
        <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
            <create-or-edit />
        </el-dialog>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import CreateOrEdit from './CreateOrEdit.vue'
import { getRoles, deleteRole } from '@/services/role'
import { Form } from 'element-ui'
export default Vue.extend({
  name: 'RoleList',
  data () {
    return {
      form: {
        name: '',
        current: 1,
        size: 5
      },
      roles: [],
      totalCount: 0,
      isLoading: false,
      dialogVisible: true
    }
  },
  created () {
    this.loadRoles()
  },
  components: {
    CreateOrEdit
  },
  methods: {
    async loadRoles () {
      this.isLoading = true
      const { data } = await getRoles(this.form)
      if (data.code === '000000') {
        this.roles = data.data.records
        this.totalCount = data.data.total
      }
      this.isLoading = false
    },
    onSubmit () {
    //   console.log('submit!')
      this.form.current = 1
      this.loadRoles()
    },
    onReset () {
    //   console.log('reset!')
      (this.$refs.form as Form).resetFields()
      this.form.current = 1
      this.loadRoles()
    },
    handleSizeChange (val: number) {
    //   console.log(`每页 ${val} 条`)
      this.form.size = val
      this.form.current = 1
      this.loadRoles()
    },
    handleCurrentChange (val: number) {
    //   console.log(`当前页: ${val}`)
      this.form.current = val
      this.loadRoles()
    },
    handleMenu (val: string) {
      console.log(val)
    },
    async delRole (item: { id: string|number }) {
      const { data } = await deleteRole(item.id)
      if (data.code === '000000') {
        this.$message.success('删除成功')
        this.loadRoles()
      }
    },
    handleClose () {
      this.$confirm('确认关闭？')
        .then(() => {
          console.log('确认')
        })
        .catch(() => {
          console.log('确认')
        })
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
