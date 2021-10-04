<template>
    <div class="user-list">
        <el-card>
            <div slot="header">
               <el-form :inline="true" :model="filterParams" ref="filterParams" class="demo-form-inline">
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="filterParams.phone" placeholder="请输入手机号"></el-input>
                </el-form-item>
                  <el-form-item label="注册时间">
                    <el-col :span="11" >
                        <el-form-item  prop="startCreateTime">
                            <el-date-picker type="date" placeholder="开始时间" v-model="filterParams.startCreateTime" style="width: 100%;"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col class="line" :span="2">-</el-col>
                    <el-col :span="11" >
                        <el-form-item prop="endCreateTime">
                            <el-date-picker placeholder="结束时间" v-model="filterParams.endCreateTime" style="width: 100%;" ></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" :disabled="isLoading" @click="onSubmit">查询</el-button>
                    <el-button :disabled="isLoading" @click="onReset">重置</el-button>
                </el-form-item>
                </el-form>
            </div>
            <el-table
                :data="users"
                v-loading="isLoading"
                style="width: 100%">
                <el-table-column
                    prop="id"
                    label="用户ID">
                </el-table-column>
                <el-table-column
                    prop="portrait"
                    label="头像">
                    <template slot-scope="scope">
                        <img class="portrait" :src="scope.portrait ? scope.portrait : require('../../../assets/avatar.png')" alt="">
                    </template>
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="用户名">
                </el-table-column>
                <el-table-column
                    prop="phone"
                    label="手机号">
                </el-table-column>
                <el-table-column
                    prop="createTime"
                    label="注册时间">
                </el-table-column>
                <el-table-column
                    prop="status"
                    label="状态">
                    <template slot-scope="scope">
                        <el-switch
                            v-model="scope.row.status"
                            active-value="ENABLE"
                            inactive-value="DISABLE"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            @change="handleForbidUser(scope.row)"
                        >
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作">
                    <template slot-scope="scope">
                        <el-button
                            v-if="scope.row.status === 'ENABLE'"
                            type="text"
                            size="small"
                            @click="disableStatus(scope.row)">禁用</el-button>
                        <el-button type="text" size="small" @click="handleSelectRole(scope.row)">分配角色</el-button>
                    </template>
                </el-table-column>
            </el-table>
                <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="filterParams.currentPage"
                :page-sizes="[5, 10, 15, 20]"
                :page-size="filterParams.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalCount"
                :disabled="isLoading">
            </el-pagination>
        </el-card>
        <el-dialog
            title="分配角色"
            :visible.sync="dialogVisible"
            width="30%"
            >
            <el-select v-model="roleIds" multiple clearable placeholder="请选择角色">
                <el-option
                v-for="item in roles"
                :key="item.id"
                :label="item.name"
                :value="item.id">
                </el-option>
            </el-select>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="onSave">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getUserPages, forbidUser, activateUser } from '@/services/user'
import { getAllRoles, allocUserRoles, getUserRoles } from '@/services/role'
import { Form } from 'element-ui'
export default Vue.extend({
  name: 'UserList',
  data () {
    return {
      filterParams: {
        currentPage: 1,
        pageSize: 10,
        phone: '',
        startCreateTime: '',
        endCreateTime: ''
      },
      users: [],
      totalCount: 0,
      isLoading: false,
      dialogVisible: false,
      roles: [],
      roleIds: [],
      userId: ''
    }
  },
  created () {
    this.loadUser()
  },
  methods: {
    // 获取用户列表
    async loadUser () {
      this.isLoading = true
      const { data } = await getUserPages(this.filterParams)
      if (data.code === '000000') {
        this.users = data.data.records
        this.totalCount = data.data.total
      }
      this.isLoading = false
    },
    // 查询
    onSubmit () {
      this.filterParams.currentPage = 1
      this.loadUser()
    //   console.log('submit!')
    },
    // 重置
    onReset () {
      (this.$refs.filterParams as Form).resetFields()
      this.filterParams.currentPage = 1
      this.loadUser()
    //   console.log('submit!')
    },
    // 每页条数变化
    handleSizeChange (val: number) {
    //   console.log('submit!')
      this.filterParams.pageSize = val
      this.filterParams.currentPage = 1
      this.loadUser()
    },
    // 分页
    handleCurrentChange (val: number) {
      this.filterParams.currentPage = val
      this.loadUser()
    },
    // 开关
    async handleForbidUser (user: any) {
      try {
        const { data } = await forbidUser(user.id)
        console.log(data, 'switch')
      } catch (err) {
        console.log(err)
      }
    },
    // 禁用
    async disableStatus (item: any) {
      try {
        const { data } = await forbidUser({ userId: item.id })
        console.log(data)
      } catch (err) {
        console.log(err)
      }
    },
    // 启用
    async enableStatus (item: any) {
      const { data } = await activateUser(item.id)
      console.log(data)
    },
    // 分配角色
    async handleSelectRole (item: any) {
      this.userId = item.id
      // 获取全部角色
      const { data } = await getAllRoles()
      if (data.code === '000000') {
        this.roles = data.data
        this.dialogVisible = true
      }
      // 获取该用户的角色
      const { data: { data: userRoles } } = await getUserRoles(item.id)
      this.roleIds = userRoles.map((item: any) => item.id)
    },
    // 提交分配的角色
    async onSave () {
      const { data } = await allocUserRoles({
        userId: this.userId,
        roleIdList: this.roleIds
      })
      if (data.code === '000000') {
        this.$message.success('操作成功')
        this.dialogVisible = false
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.portrait{
    width: 40px;
    height: 40px;
    border-radius: 50%;
}
.status{
    width: 20px;
    height: 20px;
    border-radius: 50%;
}
.enable-status {
    background-color: #00ff00;
}
.disable-status {
    background-color: #ff0000;
}
</style>
