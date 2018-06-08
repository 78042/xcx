import md5 from '../lib/md5.js'
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//倒计时
const countDown = (count = 0, callback) => {
  if (!count) {
    callback && callback();
    return false;
  }
  callback && callback(count);
  let timer = setTimeout(function update() {
    if (count-- >= 0) {
      callback(count)
      timer = setTimeout(update, 1000)
    }
  }, 1000);
  return function (clearFn) {
    clearTimeout(timer);
    clearFn && clearFn.apply(this, [].slice.call(arguments, 1))
  }
}
const salt = (obj) => {
  let keyArr = Object.keys(obj).sort(),
      _str = '';
  for (let i = 0; i < keyArr.length; i++) {
    _str += ( keyArr[i] + obj[keyArr[i]] );
  }
  _str += 'future_arriving'; 
  return md5(encodeURIComponent(_str.toLowerCase()));
  //return _str.toLowerCase()
}
module.exports = {
  formatTime: formatTime,
  countDown,
  salt
}
