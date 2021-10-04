<template>
    <div class="">
        <el-form :model="role">
            <el-form-item label="角色名称">
                <el-input v-model="role.name" placeholder="请输入角色名称"></el-input>
            </el-form-item>
            <el-form-item label="角色编码">
                <el-input v-model="role.code" placeholder="请输入角色编码"></el-input>
            </el-form-item>
            <el-form-item label="角色描述">
                <el-input type="textarea" v-model="role.description" placeholder="请输入角色描述"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button >取 消</el-button>
            <el-button type="primary" @click="onSubmit">确 定</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { createOrUpdate } from '@/services/role'
export default Vue.extend({
  name: 'CreateOrEditRole',
  data () {
    return {
      role: {
        code: '',
        name: '',
        description: ''
      }
    }
  },
  methods: {
    async onSubmit () {
      const { data } = await createOrUpdate(this.role)
      console.log(data)
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
