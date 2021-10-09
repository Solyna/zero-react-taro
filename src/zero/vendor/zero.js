/**
 * 顶级对象构造
 * jsApi 可以全部进入该对象
 */
import { navigate } from '../api'

;((w) => {
  w.Zero = {
    request: wx.request,
    get() {
      return {}
    },
    post() {
      return {}
    },

    goTo: navigate.goTo,
    goBack: navigate.goBack,
    redirect: navigate.redirect,
    reLaunch: navigate.reLaunch,

    setStorageSync: wx.setStorageSync,
    getStorageSync: wx.getStorageSync,
    removeStorageSync: wx.removeStorageSync,
  }
})(window)
