<template>
    <div class="alloc-resource">
        <el-card>
            <div slot="header">
                <span>分配资源</span>
            </div>
            <el-tree
                ref="resource-tree"
                :data="resources"
                :props="defaultProps"
                :default-checked-keys="checkedKeys"
                node-key="id"
                show-checkbox
                default-expand-all
            ></el-tree>
            <div class="alloc-resource-btns">
                <el-button type="primary" @click="onSave">保存</el-button>
                <el-button @click="resetChecked">清空</el-button>
            </div>
        </el-card>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getResourceNodeList, allocateRoleResources, getRoleResources } from '@/services/resource'
import { Tree } from 'element-ui'
export default Vue.extend({
  name: 'AllocResource',
  props: {
    roleId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      resources: [],
      defaultProps: {
        children: 'resourceList',
        label: 'name'
      },
      checkedKeys: []
    }
  },
  created () {
    this.loadResources()
    this.loadRoleResources()
  },
  methods: {
    // 获取全部菜单
    async loadResources () {
      const { data } = await getResourceNodeList(this.roleId)
      if (data.code === '000000') {
        this.resources = data.data
      }
    },
    // 获取已有菜单
    async loadRoleResources () {
      const { data } = await getRoleResources(this.roleId)
      if (data.code === '000000') {
        this.getKeys(data.data)
      }
    },
    // 数组处理
    getKeys (menus: any) {
      menus.map((item: any) => {
        if (item.selected) {
        //   this.checkedKeys.push(item.id as never)
        // push 不起作用
          this.checkedKeys = [...this.checkedKeys, item.id] as any
        }
        if (item.subMenuList) {
          this.getKeys(item.subMenuList)
        }
      })
    },
    // 保存
    async onSave () {
      const resourceIdList = (this.$refs['resource-tree'] as Tree).getCheckedKeys()
      const { data } = await allocateRoleResources({
        roleId: this.roleId,
        resourceIdList
      })
      if (data.code === '000000') {
        this.$message.success('操作成功')
        this.$router.back()
      }
    },
    // 清空
    resetChecked () {
      (this.$refs['resource-tree'] as Tree).setCheckedKeys([])
    }
  }
})
</script>

<style lang="scss" scoped>
.alloc-resource-btns{
    text-align: center;
    margin: 20px;
}
</style>
