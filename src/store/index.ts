import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: JSON.parse(window.localStorage.getItem('user') || 'null') // 当前用户登录状态
  },
  mutations: {
    // 修改容器数据，必须使用 mutation
    setUser (state, payload) {
      state.user = JSON.parse(payload)

      // 为了防止页面刷新数据丢失，我们需要把 user 数据持久化
      window.localStorage.setItem('user', payload)
    }
  },
  actions: {
  },
  modules: {
  }
})
