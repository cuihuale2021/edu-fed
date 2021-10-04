/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/**
 * 用户相关请求模块
 * */
import request from '@/utils/request'
import qs from 'qs'

interface User {
    phone: string;
    password: string
}

// 用户登录
export const login = (data: User) => {
  return request({
    method: 'POST',
    url: '/front/user/login',
    data: qs.stringify(data) // axios 默认发送的是 application/json格式的数据，使用 qs 模块转为application/x-www-form-encoded格式
  })
}

// 获取用户信息
export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/front/user/getInfo'
  })
}

// 分页查询用户信息
export const getUserPages = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/user/getUserPages',
    data
  })
}

// 启用用户
export const activateUser = (userId: string | number) => {
  return request({
    method: 'GET',
    url: '/boss/user/enableUser',
    params: {
      userId
    }
  })
}

// 封禁用户
export const forbidUser = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/user/forbidUser',
    data: qs.stringify(data)
  })
}
