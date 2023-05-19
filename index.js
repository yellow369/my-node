const express = require("express");
let fs = require("fs");
let path = require("path");

// Create express instance
const app = express();
const multer = require("multer");
const sign = require("./modules/sign/signIn");
// 解析 multipart/form-data 类型请求体
app.use(multer().array());

// 解析 post 表单数据的中间件
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

// 生成token
const { expressjwt } = require("express-jwt");
const secretKey = "EuLa No1 ^_^";
app.use(
  expressjwt({
    secret: secretKey,
    algorithms: ["HS256"],
    // 自定义token处理
    // credentialsRequired: true,
    // getToken: function fromHeaderOrQuerystring(req) {
    //   if (
    //     req.headers.authorization &&
    //     req.headers.authorization.split(" ")[0] === "Bearer"
    //   ) {
    //     return req.headers.authorization.split(" ")[1];
    //   } else if (req.query && req.query.token) {
    //     return req.query.token;
    //   }
    //   return null;
    // },
  }).unless({
    path: ["/server/sign", "/server/goods/tree", "/server/test"],
  })
);
// 解析token
app.use(sign.setUser);

// 日志
const { morgan, customLog } = require("./plugins/morgan");
app.use(morgan);

// 使用全局错误处理中间件，捕获解析 JWT 失败后产生的错误
app.use((err, req, res, next) => {
  // 这次错误是由 token 解析失败导致的
  customLog(err.stack);
  // accessLogStream.end()
  if (err.name === "UnauthorizedError") {
    // res.status(401)
    return res.send({
      status: 401,
      message: "无效的token",
    });
  }
  res.send({
    status: 500,
    message: "未知的错误",
  });
});
// 错误兜底
process.on("uncaughtException", (err) => {
  console.log(err, "--------------------------1------------");
  customLog(err.stack);
});

// Require API routes
const test = require("./routes/test");
const goods = require("./modules/goods/index");
const console = require("./modules/console/index")
const owner = require("./modules/owner/index")

// Import API Routes
app.use(test);
app.use(sign.router);
app.use(goods);
app.use(console);
app.use(owner);

// Export express app
module.exports = app;

// Start standalone server if directly running
if (require.main === module) {
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`API server listening on port ${port}`);
  });
}

