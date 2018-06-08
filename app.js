App({
  globalData: {
    tip (msg = "请求出错！", cb) {
      wx.showToast({
        title: msg,
        icon: 'none',
        duration: 2000,
        success: () => {
          return setTimeout(() => {
            cb && cb()
          }, 2080)
        }
      })
    }
  }
})