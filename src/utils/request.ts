import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'
import qs from 'qs'

const request = axios.create({
  // ...
})

// 跳转登录
function redirectLogin () {
  router.push({
    name: 'login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}

// 刷新 Token
function refreshToken () {
  return axios.create()({
    method: 'POST',
    url: '/front/user/refresh_token',
    data: qs.stringify({
      // refresh_token 只能使用 1 次
      refreshtoken: store.state.user.refresh_token
    })
  })
}

// 请求拦截器
request.interceptors.request.use(function (config) {
  // 统一设置 Token
  const { user } = store.state
  if (user && user.access_token) {
    config.headers.Authorization = user.access_token
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

// 响应拦截器
let isRefreshing = false // 控制刷新token的状态
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let requests: any[] = [] // 多个请求时，先执行一个，其他的挂起
request.interceptors.response.use(function (response) { // 状态码为 2xx 的进入这里
  return response
}, async function (error) { // 超过2xx状态码都在这里执行
  if (error.response) { // 请求发出去收到响应了，但状态码超出了 2xx 范围
    const { status } = error.response
    if (status === 400) {
      Message.error('请求参数错误')
    } else if (status === 401) {
      // token 无效（过期或错误）
      // 1. 如果有 refresh_token 则尝试使用 refresh_token 获取新的 access_token
      if (!store.state.user) {
        redirectLogin()
        return Promise.reject(error)
      }

      if (!isRefreshing) {
        isRefreshing = true // 开启刷新状态， 多个请求时，其他请求就不会再往下走
        // 1.1 尝试刷新获取新的token
        return refreshToken().then(res => {
          if (!res.data.success) {
            throw new Error('刷新 Token 失败')
          }
          // 刷新token 成功了
          store.commit('setUser', res.data.content)
          // 把 requests 队列中的请求重新发出去
          requests.forEach(cb => cb())
          // 重置 requests 数组
          requests = []
          return request(error.config)
        }).catch(error => {
          // 失败了 ——> 跳转登录页重新登录获取新的 token
          // 把当前用户登录状态清除
          store.commit('setUser', null)
          redirectLogin()
          return Promise.reject(error)
        }).finally(() => {
          isRefreshing = false
        })
      }

      // 刷新状态下，把请求挂起放到 requests 数组中
      return new Promise(resolve => {
        requests.push(() => {
          resolve(request(error.config))
        })
      })
    } else if (status === 403) {
      Message.error('没有权限，请联系管理员')
    } else if (status === 404) {
      Message.error('请求资源不存在')
    } else if (status >= 500) {
      Message.error('服务端错误，请联系管理员')
    }
  } else if (error.request) { // 请求发出去没有收到响应
    Message.error('请求超时，请刷新重试')
  } else { // 在设置请求时发生了一些事情，触发了一个错误
    Message.error(`请求失败：${error.message}`)
  }
  // 把请求失败的错误对象继续抛出，扔给下一个上一个调用者
  return Promise.reject(error)
})

export default request
