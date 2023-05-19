const { Router } = require("express");
let fs = require("fs");
let path = require("path");
const router = Router();
const { customLog } = require("../plugins/morgan");
const { suppressDeprecationWarnings } = require("moment");
const { diskStorage } = require("multer");
router.get("/test/status", function (req, res) {
  res.send({ status: 200, message: "OK" });
});
// 记录错误日志
router.get("/test/err", function (req, res) {
  try {
    sfds.map();
  } catch (error) {
    customLog(error.stack);
  }
  ss.map(1212);
  res.send({ status: 200, message: "OK" });
});

router.get("/test", function (req, res) {
  try {
    const filePath = path.resolve("./server/plugins/log");
    let files = fs.readdirSync(filePath);
    console.log(files);
    res.send({ status: 200, message: "OK", data: files });
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
