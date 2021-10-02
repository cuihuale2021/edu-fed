<template>
  <div>
    <div class="login">
      <div class="login-container">
        <h1 class="login-title">Edu Boss 管理系统</h1>
        <el-form
          label-position="top"
          ref="form"
          :model="form"
          :rules="rules"
          label-width="80px"
          class="login-form"
        >
          <h2>登录</h2>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="form.phone" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="onSubmit"
              :loading="isLoginLoading"
              class="login-btn"
            >登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { login } from '@/services/user'
import { Form } from 'element-ui'

export default Vue.extend({
  data () {
    return {
      form: {
        phone: '',
        password: ''
      },
      rules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1\d{10}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ]
      },
      isLoginLoading: false
    }
  },
  methods: {
    async onSubmit () {
      try {
        // 1. 表单验证
        await (this.$refs.form as Form).validate()
        // 登录请求期间，按钮不能点击
        this.isLoginLoading = true
        // 2. 验证通过后，提交表单
        const { data } = await login(this.form)
        console.log(data)
        // 3. 处理请求结果
        if (data.state !== 1) {
          // 失败提示
          this.$message.error(data.message)
        } else {
          // 1. 登录成功，记录登录状态，状态需要能够全局访问（放到 Vuex 中）
          this.$store.commit('setUser', data.content)
          // 2. 然后在访问需要登录的页面时，判断有没有登录状态（路由拦截器）
          // 成功后跳转到首页
          this.$router.push(this.$route.query.redirect as string || '/')
          this.$message.success('登录成功')
          // 存储token
        }
      } catch (err) {
        console.log('登录失败', err)
      }
      this.isLoginLoading = false
    }
  }
})
</script>

<style lang="scss" scoped>
.login {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .login-title {
    color: #cecece;
    text-align: center;
    margin-bottom: 40px;
  }
  .login-form {
    background-color: #fff;
    width: 300px;
    padding: 20px;
    border-radius: 5px;
  }
  .login-btn {
    width: 100%;
  }
}
</style>
