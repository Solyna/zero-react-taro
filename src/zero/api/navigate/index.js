// import navigate from "./configureNavigate";

export const navigate = {
  goTo: ({ url, payload, options }) => {
    wx.navigateTo({
      url,
      ...options,
      // events: {
      //   // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
      //   acceptDataFromOpenedPage: function(data) {
      //     console.log(data)
      //   },
      //   someEvent: function(data) {
      //     console.log(data)
      //   }
      // },
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        // res.eventChannel.emit('acceptDataFromOpenerPage', { data: 'test' })
      },
    })
  },
  goBack: ({ delta, url }) => {
    wx.navigateBack({
      delta,
    })
  },
  redirect: ({ url, payload, options }) => {
    wx.redirectTo({
      url,
      ...options,
    })
  },
  reLaunch: ({ url, payload, options }) => {
    wx.reLaunch({
      url,
      ...options,
    })
  },
}
