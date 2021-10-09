// import Zero from '@/zero/vendor/zero'
// import { store } from '@/zero/redux'
// import { BaseApp } from '@/zero/core'
// import model from './app.model'
// import './app.less'

App({
  onLaunch(options) {
    console.log(options, 'options......')
  },
  onShow(options) {
    console.log('Zero......')

    // 获取当前页面实例
    const pages = getCurrentPages() || []
    const currentPage = pages[pages.length - 1]

    // 获取当前页面的 window 对象和 document 对象
    if (currentPage) {
      console.log(currentPage.window)
      console.log(currentPage.document)
    }
  },
  onHide() {},
  onError(err) {},
  onPageNotFound(options) {},
  // globalData: { store, appModel: model },
})
