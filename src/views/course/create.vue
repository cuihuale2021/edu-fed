<template>
    <div class="create-course">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
            <!-- 步骤条 -->
            <el-steps :active="activeStep" finish-status="success" simple style="margin-top: 20px">
                <el-step
                  v-for="(item, index) in steps"
                  :key="index"
                  :title="item.title"
                  @click.native="activeStep = index"
                  ></el-step>
            </el-steps>
        </div>
        <el-form label-width="80px">
          <div v-show="activeStep === 0">
            <el-form-item label="课程名称">
              <el-input></el-input>
            </el-form-item>
            <el-form-item label="课程简介">
              <el-input></el-input>
            </el-form-item>
            <el-form-item label="课程概述">
              <el-input type="textarea"></el-input>
            </el-form-item>
            <el-form-item label="讲师姓名">
              <el-input></el-input>
            </el-form-item>
            <el-form-item label="讲师简介">
              <el-input></el-input>
            </el-form-item>
            <el-form-item label="课程排序">
              <el-input-number label="描述文字"></el-input-number>
            </el-form-item>
          </div>
          <div v-show="activeStep === 1">
            <el-form-item label="课程封面">
              <!-- 组件需要根据绑定的数据进行图片预览，也需要把上传成功的图片地址同步到绑定的数据中 -->
              <course-image v-model="course.courseListImg" />
            </el-form-item>
            <el-form-item label="介绍封面">
              <course-image v-model="course.courseImgUrl"/>
            </el-form-item>
          </div>
          <div v-show="activeStep === 2">
            <el-form-item label="售卖价格">
              <el-input>
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="商品原价">
              <el-input>
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="销量">
              <el-input>
                <template slot="append">单</template>
              </el-input>
            </el-form-item>
            <el-form-item label="活动标签">
              <el-input></el-input>
            </el-form-item>
          </div>
          <div v-show="activeStep === 3">
            <el-form-item label="限时秒杀">
              <el-switch
              v-model="isSeckill"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
            </el-form-item>
            <template v-if="isSeckill">
              <el-form-item label="开始时间">
                <el-date-picker type="datetime" placeholder="选择日期时间"></el-date-picker>
              </el-form-item>
              <el-form-item label="结束时间">
                <el-date-picker type="datetime" placeholder="选择日期时间"></el-date-picker>
              </el-form-item>
              <el-form-item label="秒杀价">
                <el-input>
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
              <el-form-item label="秒杀库存">
                <el-input>
                  <template slot="append">个</template>
                </el-input>
              </el-form-item>
            </template>
          </div>
          <div v-show="activeStep === 4">
            <el-form-item label="课程详情">
              <el-input type="textarea"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary">保存</el-button>
            </el-form-item>
          </div>
          <el-form-item v-if="activeStep >= 0 && activeStep < 4">
              <el-button @click="activeStep++">下一步</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import CourseImage from './components/CourseImage.vue'

export default Vue.extend({
  name: 'CreateCourse',
  data () {
    return {
      activeStep: 0,
      steps: [
        {
          title: '基本信息'
        },
        {
          title: '课程封面'
        },
        {
          title: '销售信息'
        },
        {
          title: '秒杀活动'
        },
        {
          title: '课程详情'
        }
      ],
      imageUrl: '',
      isSeckill: true, // 是否开启秒杀
      course: {
        id: 0,
        courseName: '',
        brief: '',
        teacherDTO: {
          id: 0,
          courseId: 0,
          teacherName: '',
          teacherHeadPicUrl: '',
          position: '',
          description: ''
        },
        courseDescriptionMarkDown: '',
        price: 0,
        discounts: 0,
        priceTag: '',
        discountsTag: '',
        isNew: true,
        isNewDes: '',
        courseListImg: '',
        courseImgUrl: '',
        sortNum: 0,
        previewFirstField: '',
        previewSecondField: '',
        status: 0,
        sales: 0,
        activityCourse: true,
        activityCourseDTO: {
          id: 0,
          courseId: 0,
          beginTime: '',
          endTime: '',
          amount: 0,
          stock: 0
        },
        autoOnlineTime: ''
      }
    }
  },
  components: {
    CourseImage
  },
  methods: {

  }
})
</script>

<style lang="scss" scoped>
.el-step{
  cursor: pointer;
}

</style>
