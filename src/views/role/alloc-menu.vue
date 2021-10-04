<template>
    <div class="alloc-menu">
        <el-card>
            <div slot="header">
                <span>分配菜单</span>
            </div>
            <el-tree
                ref="menu-tree"
                :data="menus"
                :props="defaultProps"
                :default-checked-keys="checkedKeys"
                node-key="id"
                show-checkbox
                default-expand-all
            ></el-tree>
            <div class="alloc-menu-btns">
                <el-button type="primary" @click="onSave">保存</el-button>
                <el-button @click="resetChecked">清空</el-button>
            </div>
        </el-card>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getMenuNodeList, allocateRoleMenus, getRoleMenus } from '@/services/menu'
import { Tree } from 'element-ui'
export default Vue.extend({
  name: 'AllocMenu',
  props: {
    roleId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      menus: [],
      defaultProps: {
        children: 'subMenuList',
        label: 'name'
      },
      checkedKeys: []
    }
  },
  created () {
    this.loadMenus()
    this.loadRoleMenus()
  },
  methods: {
    // 获取全部菜单
    async loadMenus () {
      const { data } = await getMenuNodeList()
      if (data.code === '000000') {
        this.menus = data.data
      }
    },
    // 获取已有菜单
    async loadRoleMenus () {
      const { data } = await getRoleMenus(this.roleId)
      console.log(data)
      if (data.code === '000000') {
        this.getKeys(data.data)
        // console.log(this.checkedKeys)
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
      const menuIdList = (this.$refs['menu-tree'] as Tree).getCheckedKeys()
      const { data } = await allocateRoleMenus({
        roleId: this.roleId,
        menuIdList
      })
      if (data.code === '000000') {
        this.$message.success('操作成功')
        this.$router.back()
      }
    },
    // 清空
    resetChecked () {
      (this.$refs['menu-tree'] as Tree).setCheckedKeys([])
    }
  }
})
</script>

<style lang="scss" scoped>
.alloc-menu-btns{
    text-align: center;
    margin: 20px;
}
</style>
