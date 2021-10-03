/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/**
 * 菜单相关请求模块
 * */
import request from '@/utils/request'

// 创建或更新菜单
export const createOrUpdateMenu = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/menu/saveOrUpdate',
    data
  })
}

// 处理上级菜单
export const getEditMenuInfo = (id: string | number = -1) => {
  return request({
    method: 'GET',
    url: '/boss/menu/getEditMenuInfo',
    params: {
      id
    }
  })
}

// 获取菜单列表
export const getAllMenus = () => {
  return request({
    method: 'GET',
    url: '/boss/menu/getAll'
  })
}

// 删除菜单
export const deleteMenu = (id: number) => {
  return request({
    method: 'DELETE',
    url: `/boss/menu/${id}`
  })
}
