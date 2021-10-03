import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'
import store from '@/store/index'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: 'login' */ '@/views/login/index.vue')
  },
  {
    path: '/',
    component: Layout,
    meta: {
      requiresAuth: true // 自定义路由信息，用于导航守卫
    },
    children: [
      {
        path: '', // 默认子路由
        name: 'home',
        component: () => import(/* webpackChunkName: 'home' */ '@/views/home/index.vue')
      },
      {
        path: '/role',
        name: 'role',
        component: () => import(/* webpackChunkName: 'role' */ '@/views/role/index.vue')
      },
      {
        path: '/menu',
        name: 'menu',
        component: () => import(/* webpackChunkName: 'menu' */ '@/views/menu/index.vue')
      },
      {
        path: '/menu/create',
        name: 'menu-create',
        component: () => import(/* webpackChunkName: 'menu-create' */ '@/views/menu/create.vue')
      },
      {
        path: '/menu/:id/edit',
        name: 'menu-edit',
        component: () => import(/* webpackChunkName: 'menu-create' */ '@/views/menu/edit.vue'),
        props: true
      },
      {
        path: '/resource',
        name: 'resource',
        component: () => import(/* webpackChunkName: 'resource' */ '@/views/resource/index.vue')
      },
      {
        path: '/course',
        name: 'course',
        component: () => import(/* webpackChunkName: 'course' */ '@/views/course/index.vue')
      },
      {
        path: '/user',
        name: 'user',
        component: () => import(/* webpackChunkName: 'user' */ '@/views/user/index.vue')
      },
      {
        path: '/advert',
        name: 'advert',
        component: () => import(/* webpackChunkName: 'advert' */ '@/views/advert/index.vue')
      },
      {
        path: '/advert-space',
        name: 'advert-space',
        component: () => import(/* webpackChunkName: 'advert-space' */ '@/views/advert-space/index.vue')
      }
    ]
  },
  {
    path: '*',
    name: '404',
    component: () => import(/* webpackChunkName: '404' */ '@/views/error-page/404.vue')
  }
]

const router = new VueRouter({
  routes
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // to.matched 是一个数组, 父路由与本路由
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.state.user) {
      // 跳转到登录页面
      next({
        name: 'login',
        query: { // 登录成功后跳转回原来的地址
          redirect: to.fullPath
        }
      })
    } else {
      next() // 允许通过
    }
  } else {
    next()
  }
})

export default router
