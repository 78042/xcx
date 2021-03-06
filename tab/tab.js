// tab/tab.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    route: String
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    linkTo(e) {
      let { route } = e.currentTarget.dataset;
      wx.navigateTo({
        url: `/pages/${route}/${route}`,
      })
    }
  }
})
