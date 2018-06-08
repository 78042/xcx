import ajax from '../../api/index.js';
import util from '../../utils/util.js'

Page({
  data: {
    tel: '',
    code: '',
    loginBtnDisabled: false,
    codeText: '获取验证码'
  },
  bindKeyInput (e) {
    let { value } = e.detail,
        { which } = e.currentTarget.dataset,
        loginBtnDisabled;
    if (which === 'tel') {
      loginBtnDisabled = !(this.telTest(value) && this.codeTest(this.data.code) && this.successGetCode);
    }else {
      loginBtnDisabled = !(this.telTest(this.data.tel) && this.codeTest(value) && this.successGetCode);
    }
    this.setData({
      [which]: value,
      loginBtnDisabled
    })
  },
  clearTel () {
    this.setData({
      tel: ''
    })
  },
  telTest (val) {
    return /^1[3-9]{1}\d{9}$/.test(val);
  },
  codeTest (val) {
    return /^\d{4}$/.test(val);
  },
  tip(msg = "请求出错！", cb) {
    wx.showToast({
      title: msg,
      icon: 'none',
      duration: 2000,
      success: () => {
        return setTimeout(() => {
          cb && cb()
        },2080)
      }
    })
  },
  getCode () {
    if (this.hasSendcode) {
      return false;
    }
    if (!this.data.tel) {
      this.tip('请输入手机号码！')
    } else if (!/^1[3-9]{1}\d{9}$/.test(this.data.tel)) {
      this.tip('请输入正确的手机号码！')
    }else {
      this.hasSendcode = true;
      let countDown = util.countDown(10, (count) => {
        if (count >= 0) {
          this.setData({
            codeText: `${count} S`
          })
        } else {
          this.setData({
            codeText: '获取验证码'
          })
          this.hasSendcode = false;
        }
      })
      let _this = this;
      ajax({
        url: '/leader/get_verification_code',
        method: 'POST',
        data: {
          mobile: _this.data.tel
        },
        success (res) {
          let { msg, code } = res.data;
          if (code === 0) {
            _this.successGetCode = true;
            _this.tip(msg);
          }else {
            _this.tip(msg,()=>{
              countDown();
              _this.hasSendcode = false;
              _this.setData({
                codeText: '获取验证码'
              })
            });
          }
        },
        fail () {
          _this.tip()
        }
      })
    }
  },
  login () {
    wx.navigateTo({
      url: '../xunban/xunban'
    })
    if (this.data.loginBtnDisabled) {
      return false;
    }else {
      let _this = this;
      ajax({
        url: '/leader/login',
        method: 'POST',
        data: {
          mobile: _this.data.tel,
          verification_code: _this.data.code
        },
        success(res) {
          let { msg, code, id } = res.data;
          if (code === 0) {
            wx.setStorageSync('tel', _this.data.tel);
            wx.setStorageSync('school-id', _this.data.id);
            wx.navigateTo({
              url: '../xunban/xunban'
            })
          } else {
            _this.tip(msg);
          }
        },
        fail() {
          _this.tip()
        }
      })
    }
  }
})