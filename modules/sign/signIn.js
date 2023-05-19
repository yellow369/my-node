const jwt = require("jsonwebtoken");
const app = require("../../index");
const { Router } = require("express");
const router = Router();
const { querySql } = require("../base/mysql");
const { beforeTomorrow } = require("../../utils/beforeTomorrow");

// TODO_04：注册将 JWT 字符串解析还原成 JSON 对象的中间件
// 注意：只要配置成功了 express-jwt 这个中间件，就可以把解析出来的用户信息，挂载到 req.user 属性上
const secretKey = "EuLa No1 ^_^";

const setUser = function (req, res, next) {
  // console.log(req.headers.authorization);
  if(req.headers.authorization) {
    let userinfo = jwt.decode(req.headers.authorization.slice(7), secretKey);
    req.query = {...userinfo,...req.query}
  }
  
  next();
};

router.post("/sign", function (req, res) {
  const userinfo = req.body;
  let timeout = beforeTomorrow() + "s";
  console.log(timeout);
  let query = `select * from user where account='${userinfo.account}' and password='${userinfo.password}'`;
  querySql(query).then((user) => {
    try {
      if (user.length == 0) {
        res.status(400);
        return res.send({
          status: 400,
          message: "用户名或密码错误",
        });
      } else {
        const token = jwt.sign(
          { name: user[0].name, account: user[0].account, userId: user[0].id, ownerId: user[0].ownerId },
          secretKey,
          // 第二天0点过期
          { expiresIn: timeout }
        );
        let data = user[0];
        delete data.password;

        return res.send({
          status: 200,
          message: "登录成功",
          data,
          token: 'Bearer ' + token,
        });
      }
    } catch (error) {
      res.send({
        message: error,
        status: 500,
      });
    }
  });
});

module.exports = { router, setUser };
