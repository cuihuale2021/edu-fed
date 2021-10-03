/**
 * 资源相关请求模块
 * */
import request from '@/utils/request'

// 获取资源列表
export const getResourcePages = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/resource/getResourcePages',
    data
  })
}
