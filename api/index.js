import util from '../utils/util.js'

const domain = 'https://dev.futurearriving.com';
const ajax = (opt) => {
  let cType = 'application/json';
  if (opt.method === 'POST') {
    cType = 'application/x-www-form-urlencoded';
  }
  opt.data.sign = util.salt(opt.data); 
  return wx.request({
    url: `${domain}${opt.url}`,
    method: opt.method,
    data: opt.data,
    header: {
      'content-type': cType
    },
    success: (res) => opt.success && opt.success(res),
    fail: (error) => opt.fail && opt.fail(error),
    complete: (res) => opt.complete && opt.complete(res)
  })
}

export default ajax;