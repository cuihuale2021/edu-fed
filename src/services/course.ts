/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/**
 * 课程相关请求模块
 * */
import request from '@/utils/request'

// 分页查询课程信息
export const getQueryCourses = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/course/getQueryCourses',
    data
  })
}

// 课程上下架
export const changeState = (params: any) => {
  return request({
    method: 'GET',
    url: '/boss/course/changeState',
    params
  })
}

// 上传图片
export const uploadCourseImage = (data: any, onUploadProgress: (progressEvent: any) => void) => {
  // 该接口要求的数据类型是： multipart/form-data, 提交 FormData 数据类型
  return request({
    method: 'POST',
    url: '/boss/course/upload',
    data,
    onUploadProgress
  })
}
