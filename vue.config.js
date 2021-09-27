module.exports = {
  css: {
    loaderOptions: {
      // 给 sass-loader 传递选项
      // @ 是 src/ 的别名
      scss: {
        prependData: '@import "~@/styles/variables.scss";'
      }
    }
  },
  devServer: {
    proxy: {
      '/boss': {
        target: 'http://eduboss.lagou.com',
        changeOrigin: true // 请求中的host配置为target
      },
      '/front': {
        target: 'http://edufront.lagou.com',
        changeOrigin: true
      }
    }
  }
}
