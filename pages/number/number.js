import ajax from '../../api/index.js';
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabActive: 'new',
    addList: [],
    existentList: []  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fetchData_waitapprove(true);
    this.fetchData_teacher();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (wx.getStorageSync('number-refresh')) {
      wx.setStorageSync('number-refresh',false)
      this.fetchData_teacher();
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
    console.log(1)
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
  fetchData_waitapprove (isInit) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let _this = this;
    ajax({
      url: '/leader/teacher/waitapprove',
      method: 'GET',
      data: {
        schoolId: wx.getStorageSync('school-id')
      },
      success(res) {
        wx.hideLoading()
        let { msg, code, data } = res.data;
        if (code === 0) {
          _this.setData({
            addList: data
          })
          !isInit && app.globalData.tip(msg);
        } else {
          app.globalData.tip(msg)
        }
      },
      fail() {
        app.globalData.tip()
      }
    })
  },
  fetchData_teacher() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let _this = this;
    ajax({
      url: '/leader/teacher',
      method: 'GET',
      data: {
        schoolId: wx.getStorageSync('school-id')
      },
      success(res) {
        wx.hideLoading()
        let { msg, code, data } = res.data;
        if (code === 0) {
          //wx.setStorageSync('teacher-list', data);
          _this.setData({
            existentList: data
          })
        } else {
          app.globalData.tip(msg)
        }
      },
      fail() {
        app.globalData.tip()
      }
    })
  },
  waitapprove_execute (api,id) {
    let _this = this;
    ajax({
      url: `/leader/teacher${api}`,
      method: 'GET',
      data: {
        id
      },
      success(res) {
        let { msg, code, data } = res.data,
            addedItem = {};
        if (api === '/pass') {
          let new_addList = [];
          _this.data.addList.forEach(item=>{
            if (item.id == id) {
              addedItem = item;
            }else {
              new_addList.push(item);
            }
          })
          if (code === 0) {
            _this.setData({
              addList: new_addList,
              existentList: [..._this.data.existentList,addedItem]
            })
          } 
        } else if (api === '/reject') {
          if (code === 0) {
            _this.setData({
              addList: _this.data.addList.filter(item=>item.id!=id)
            })
          } 
        }
        app.globalData.tip(msg)
        
      },
      fail() {
        app.globalData.tip()
      }
    })
  },
  switchTab (e) {
    let { tab } = e.currentTarget.dataset;
    if (tab === 'new') {
      if (this.again) {
        if (this.timer) {
          app.globalData.tip('请不要过于频繁刷新！')
        }else {
          this.timer = setTimeout(()=>{
            clearTimeout(this.timer);
            this.timer = null;
          },5000)
          this.fetchData_waitapprove();
        }
      }
      this.again = true;
    }else {
      this.again = false;
    }
    this.setData({
      tabActive: tab
    })
  },
  execute (e) {
    let { action,id } = e.currentTarget.dataset;
    if (action === 'add') {
      this.waitapprove_execute('/pass',id)
    }else if (action === 'reject') {
      this.waitapprove_execute('/reject', id)
    } else if (action === 'edit') {
      wx.setStorageSync('edited-teacher', this.data.existentList.find(item=>item.id==id));
      wx.navigateTo({
        url: '/pages/edit/edit',
      })
    }
  }
})