<template>
    <div class="resource-list">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <el-form :inline="true" :model="form" ref="form" class="demo-form-inline">
                    <el-form-item label="资源名称" prop="name">
                        <el-input v-model="form.name" placeholder="请输入资源名称"></el-input>
                    </el-form-item>
                    <el-form-item label="资源路径" prop="url">
                        <el-input v-model="form.url" placeholder="请输入资源路径"></el-input>
                    </el-form-item>
                    <el-form-item label="资源分类" prop="categoryId">
                        <el-select v-model="form.categoryId" clearable placeholder="请选择资源分类">
                            <el-option
                                v-for="item in resourceCategories"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" :disabled="isLoading" @click="onSubmit">查询</el-button>
                        <el-button :disabled="isLoading" @click="onReset">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-table
                :data="resources"
                style="width: 100%"
                border
                v-loading="isLoading"
            >
                <el-table-column type="index" label="编号" width="120" align="center"></el-table-column>
                <el-table-column prop="name" label="资源名称" align="center"></el-table-column>
                <el-table-column prop="url" label="资源路径" align="center"></el-table-column>
                <el-table-column prop="description" label="描述" align="center"></el-table-column>
                <el-table-column prop="createdTime" label="添加时间" align="center"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
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
                :disabled="isLoading"
                class="pagination"
            ></el-pagination>
        </el-card>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getResourcePages } from '@/services/resource'
import { getResourceCategories } from '@/services/resource-category'
import { Form } from 'element-ui'
export default Vue.extend({
  name: 'ResourceList',
  data () {
    return {
      form: {
        name: '',
        url: '',
        categoryId: '',
        current: 1, // 默认查询第1页数据
        size: 10 // 每页数据条数
      },
      resources: [],
      totalCount: 0,
      resourceCategories: [], // 资源分类列表
      isLoading: false
    }
  },
  created () {
    this.loadResources()
    this.loadResourceCategories()
  },
  methods: {
    async loadResourceCategories () {
      const { data } = await getResourceCategories()
      //   console.log(data)
      if (data.code === '000000') {
        this.resourceCategories = data.data
      }
    },
    async loadResources () {
      this.isLoading = true
      const { data } = await getResourcePages(this.form)
      console.log(data)
      if (data.code === '000000') {
        this.resources = data.data.records
        this.totalCount = data.data.total
      }
      this.isLoading = false
    },
    onSubmit () {
      this.form.current = 1
      this.loadResources()
    //   console.log('submit!')
    },
    onReset () {
      (this.$refs.form as Form).resetFields()
      this.form.current = 1
      this.loadResources()
    //   console.log('reset')
    },
    handleEdit (item: any) {
      console.log('编辑')
    },
    handleDelete (item: any) {
      console.log('删除')
    },
    handleSizeChange (val: number) {
      this.form.size = val
      this.form.current = 1 // 改变每页大小，都显示查询到的第1页
      this.loadResources()
    //   console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val: number) {
      // 请求获取对应页面的数据
      this.form.current = val
      this.loadResources()
      //   console.log(`当前页: ${val}`)
    }
  }
})
</script>

<style lang="scss" scoped>
.pagination{
    margin-top: 20px;
}
</style>
