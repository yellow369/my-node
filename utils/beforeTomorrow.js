//
module.exports = {
  beforeTomorrow: function beforeTomorrow() {
    let date = new Date();
    // 获取当前时间-毫秒数
    let m1 = date.getTime();
    // 设置为当前天凌晨0:0:0
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    // 获取当前天凌晨距离----毫秒数
    let m0 = date.getTime();
    // 获取距离明天的秒数
    let m = 60 * 60 * 24 - (m1 - m0) / 1000;
    return m;
  },
};
