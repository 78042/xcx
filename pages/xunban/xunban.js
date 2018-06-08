import ajax from '../../api/index.js';
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoading: true,
    tabShow: true,
    listShow: false,
    classListData: [],
    curClassId: 0,
    liveSrc: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let _this = this;
    ajax({
      url: '/leader/class',
      method: 'GET',
      data: {
        schoolId: wx.getStorageSync('school-id')
      },
      success(res) {
        let { msg, code, data } = res.data;
        if (code === 0) {
          wx.setStorageSync('class-list',data);
          _this.setData({
            classListData: data,
            curClassId: data[0].id
          })
          _this.getLiveId(data[0].id, true)
        } else {
          app.globalData.tip(msg)
        }
      },
      fail() {
        app.globalData.tip()
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (wx.getStorageSync('class-changed')) {
      wx.setStorageSync('class-changed',false)
      this.setData({
        classListData: wx.getStorageSync('class-list')
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  linkTo (e) {
    let { route } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/${route}/${route}`,
    })
  },
  getLiveId (classId,isInit) {
    let _this = this;
    _this.setData({
      isLoading: true
    })
    ajax({
      url: '/leader/class/get_video',
      method: 'GET',
      data: {
        class_id: classId,
        school_id: wx.getStorageSync('school-id')
      },
      success(res) {
        let { msg, code, data } = res.data;
        if (code === 0) {
          _this.setData({
            isLoading: false,
            liveSrc: data.playUrlRtmp
          },()=>{
            if (!isInit) {
              _this.onlistShow()
            }
          })
        } else {
          app.globalData.tip(msg)
        }
      },
      fail() {
        _this.onlistShow()
        app.globalData.tip()
      }
    })
  },
  selectClass(e) {
    let { id } = e.currentTarget.dataset;
    this.setData({
      curClassId: id
    })
    this.getLiveId(id)
  },
  onlistShow () {
    this.setData({
      listShow: !this.data.listShow,
      tabShow: !this.data.tabShow
    })
  }
})