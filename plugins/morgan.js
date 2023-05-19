// 日志
let morgan = require("morgan");
let fs = require("fs");
let path = require("path");
let logPath = __dirname + "/log";

// 创建文件夹
if (!fs.existsSync(logPath)) {
  fs.mkdirSync(logPath);
}
// 自定义写入
function customLog(val) {
  accessLogStream.write(val + "\n");
}

const FileStreamRotator = require("file-stream-rotator");

let accessLogStream = FileStreamRotator.getStream({
  date_format: "YYYY-MM-DD", // 日期格式
  filename: path.join(logPath, "%DATE%.log"), //日志文件名称
  frequency: "daily", // 每日创建新文件
  verbose: false,
});


// 超过三十个日志删除
const filePath = path.resolve("./server/plugins/log");
let files = fs.readdirSync(filePath);
// console.log(files);

if (files && files.length > 30) {
  let num = files.length - 30;
  for (let index = 0; index < num; index++) {
    fs.unlink(filePath + "/" + files[index], (err) => {
      customLog("删除失败:" + err);
    });
  }
}
const schedule = require("node-schedule");
const scheduleCronstyle = () => {
  var rule = new schedule.RecurrenceRule();
  rule.hour = 0;
  rule.minute = 0;
  rule.second = 0;
  schedule.scheduleJob(rule, () => {
    const filePath = path.resolve("./server/plugins/log");
    let files = fs.readdirSync(filePath);
    console.log(files);

    if (files && files.length > 30) {
      let num = files.length - 30;
      for (let index = 0; index < num; index++) {
        fs.unlink(filePath + "/" + files[index], (err) => {
          customLog("删除失败:" + err);
        });
      }
    }
  });
};
scheduleCronstyle();
//------------------------------------------------------------------------


module.exports = {
  morgan: morgan("combined", { stream: accessLogStream }),
  customLog,
};
