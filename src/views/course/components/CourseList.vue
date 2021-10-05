<template>
    <div class="course-list">
        <!-- 查询条件 -->
      <el-card class="box-card condition">
        <div slot="header" class="clearfix">
            <span>数据筛选</span>
        </div>
        <el-form :model="form" ref="form" label-width="80px">
            <el-form-item label="课程名称" prop="courseName">
                <el-input v-model="form.courseName"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-select v-model="form.status" placehoder="请选择状态">
                    <el-option label="全部" value="">全部</el-option>
                    <el-option label="上架" value="1">上架</el-option>
                    <el-option label="下架" value="0">下架</el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button :disabled="isLoading" @click="onReset">重置</el-button>
                <el-button type="primary" :disabled="isLoading" @click="onSubmit">查询</el-button>
            </el-form-item>
        </el-form>
      </el-card>
      <!-- 表格展示 -->
      <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span>查询结果：</span>
            <el-button style="float: right;" type="primary" @click="$router.push({
                name: 'course-create'
            })">添加课程</el-button>
        </div>
        <el-table :data="courses" v-loading="isLoading">
            <el-table-column prop="id" label="ID"></el-table-column>
            <el-table-column prop="courseName" label="课程名称"></el-table-column>
            <el-table-column prop="price" label="价格"></el-table-column>
            <el-table-column prop="sortNum" label="排序"></el-table-column>
            <el-table-column prop="status" label="上架状态">
                <template slot-scope="scope">
                    <el-switch
                        v-model="scope.row.status"
                        :active-value="1"
                        :inactive-value="0"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        :disabled = "scope.row.isStatusLoading"
                        @change="onChangeState(scope.row)">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="">
                    <el-button>编辑</el-button>
                    <el-button>内容管理</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="form.currentPage"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="form.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount"
            :disabled="isLoading"
            >
        </el-pagination>
      </el-card>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getQueryCourses, changeState } from '@/services/course'
import { Form } from 'element-ui'
export default Vue.extend({
  name: 'CourseList',
  data () {
    return {
      form: {
        currentPage: 1,
        pageSize: 10,
        courseName: '',
        status: ''
      },
      courses: [],
      totalCount: 0,
      isLoading: false
    }
  },
  created () {
    this.loadCourses()
  },
  methods: {
    // 获取课程信息
    async loadCourses () {
      this.isLoading = true
      const { data } = await getQueryCourses(this.form)
      if (data.code === '000000') {
        // 课程对象上下架 loading
        data.data.records.forEach((item: any) => {
          item.isStatusLoading = false
        })
        this.courses = data.data.records
        this.totalCount = data.data.total
      }
      this.isLoading = false
    },
    // 查询
    onSubmit () {
      this.form.currentPage = 1
      this.loadCourses()
    },
    // 重置
    onReset () {
      (this.$refs.form as Form).resetFields()
      // 重新获取数据
      this.form.currentPage = 1
      this.loadCourses()
    },
    handleSizeChange (val: number) {
      this.form.pageSize = val
      this.form.currentPage = 1
      this.loadCourses()
    },
    handleCurrentChange (val: number) {
      this.form.currentPage = val
      this.loadCourses()
    },
    // 课程上下架
    async onChangeState (course: any) {
      course.isStatusLoading = true
      const { data } = await changeState({
        courseId: course.id,
        status: course.status
      })
      if (data.code === '000000') {
        this.$message.success(course.status === 0 ? '下架成功' : '上架成功')
      }
      course.isStatusLoading = false
    }
  }
})
</script>

<style lang="scss" scoped>
.condition {
    margin-bottom: 20px;
}
</style>
