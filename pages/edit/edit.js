import ajax from '../../api/index.js';
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: true,
    classListData: [],
    editedTeacher: {},
    classId: 0,
    className: '',
    originalTeacherId: 0,
    originalTeacher:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let editedTeacher = wx.getStorageSync('edited-teacher'),
        wx_classList = wx.getStorageSync('class-list');
    this.setData({
      editedTeacher: editedTeacher,
      classId: editedTeacher.classId
    })
    if (wx_classList && wx_classList.length!==0) {
      this.setData({
        classListData: wx_classList
      })
      return false;
    }
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
          wx.setStorageSync('class-list', data);
          _this.setData({
            classListData: data
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
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
  actionDel (id) {
    let _this = this;
    ajax({
      url: '/leader/teacher',
      method: 'DELETE',
      data: {
        id
      },
      success(res) {
        let { msg, code, data } = res.data;
        if (code === 0) {
          wx.setStorageSync('from-edit', true);
          wx.switchTab({
            url: '/pages/number/number'
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
  actionComfrim(data,callback) {
    let _this = this,
      { classId, teacherId, originalTeacherId, editedTeacherName, editedClassId, className } = data,
      _data = originalTeacherId ? { classId, teacherId, originalTeacherId } : { classId, teacherId };
    
    ajax({
      url: '/leader/teacher/classChange',
      method: 'GET',
      data: _data,
      success(res) {
        let { msg, code, data } = res.data;
        if (code === 0) {
          let classList = wx.getStorageSync('class-list'),
            new_classList = classList.map(item => {
              if (classId == item.id) {
                return { ...item, userId: teacherId, teacherName: editedTeacherName }
              } else if (editedClassId == item.id) {
                return { ...item, userId: 0, teacherName: '' }
              }
              return item;
            }),
            editedTeacher = wx.getStorageSync('edited-teacher'),
            newEditedTeacher = { ...editedTeacher, classId, className };
          wx.setStorageSync('class-list', new_classList)
          wx.setStorageSync('edited-teacher', newEditedTeacher)
          wx.setStorageSync('number-refresh', true);
          wx.setStorageSync('class-changed', true)
          _this.setData({
            classListData: new_classList,
            editedTeacher: newEditedTeacher
          },()=>{
            callback && callback()
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
  execute (e) {
    let { action, id } = e.currentTarget.dataset,
        { classId, className, userName } = wx.getStorageSync('edited-teacher'),
        _this = this;
    if (action === 'del') {
      wx.showModal({
        title: '解除人员',
        content: classId ? `${className}的班主任是${userName}老师，是否删除${userName}老师？` : `确认要删除${userName}老师？`,
        confirmColor: '#007AFF',
        success: function (res) {
          if (res.confirm) {
            _this.actionDel(id)
          }
        }
      })
      
    } else if (action === 'comfrim') {
      let { classId, originalTeacherId, originalTeacher, editedTeacher,className } = _this.data,
          changeFlag = classId == editedTeacher.classId,
          content = changeFlag ? '确定维持原状态？'
                              : originalTeacherId
                              ? `是否将${className}的班主任由${originalTeacher}老师变更为${editedTeacher.userName}老师？`
                              : `是否安排${editedTeacher.userName}为${className}的班主任？`
      wx.showModal({
        title: '',
        content,
        confirmColor: '#007AFF',
        success: function (res) {
          if (changeFlag) {
            return false;
          }
          if (res.confirm) {
            _this.actionComfrim({
              classId,
              editedClassId: editedTeacher.classId,
              className,
              teacherId: id,
              originalTeacherId,
              editedTeacherName: editedTeacher.userName
            },()=>{
              _this.setData({
                isShow: true
              })
            })        
          }
        }
      })
      
      
    }
  },
  onselect (e) {
    let { classId, className, oldTeacherId, oldTeacher } = e.currentTarget.dataset;
    this.setData({
      classId,
      className,
      originalTeacherId: oldTeacherId,
      originalTeacher: oldTeacher
    })
  },
  goSelectClass (e) {
    this.setData({
      isShow: false
    })
  }
})