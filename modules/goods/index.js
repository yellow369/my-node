const app = require("../../index");
const { Router } = require("express");
const router = Router();
const { querySql } = require("../base/mysql");

//  展示用，不判断登录
router.get("/goods/tree", function (req, res) {
  let query = `select * from goods`;
  querySql(query).then((data) => {
    try {
      function arrToTree(arr) {
        if (
          Object.prototype.toString.call(arr) !== "[object Array]" ||
          arr.length <= 0
        )
          return arr;
        let map = {},
          res = [];
        arr.forEach((el) => (map[el.id] = el));
        arr.forEach((el) => {
          // 如果有父元素，让它连接到父元素，否则没有父元素，就是根节点
          if (map[el.parentId]) {
            map[el.parentId].children = map[el.parentId].children || [];
            map[el.parentId].children.push(el);
          } else {
            res.push(el);
          }
        });
        return res;
      }

      let dataTree = arrToTree(data);

      return res.send({
        status: 200,
        message: "OK",
        data: dataTree,
      });
    } catch (error) {
      res.send({
        message: error,
        status: 500,
      });
    }
  });
});

router.post("/goods/submit", function (req, res) {
  var buffers = [];
  req.on("data", function (chunk) {
    buffers.push(chunk);
  });
  req.on("end", function () {
    let requestBody = Buffer.concat(buffers).toString();
    try {
      requestBody = JSON.parse(requestBody);
      if (requestBody.goodsIds && requestBody.userId) {
        let sql = `update user set goods="${requestBody.goodsIds}" where id=${requestBody.userId};`;
        querySql(sql).then((data) => {
          res.send({
            status: 200,
            message: "OK",
            data,
          });
        });
      } else {
        res.send({
          status: 200,
          message: "参数错误",
        });
      }
    } catch (error) {
      console.log(error);
    }
  });
});

router.get("/goods/list/:id", function (req, res) {
  let query = `select goods from user where id = ${req.params.id}`;
  querySql(query).then((data) => {
    try {
      let arr = data[0].goods.split(",");
      arr.map((item, index) => {
        arr[index] = parseInt(item);
      });
      return res.send({
        status: 200,
        message: "OK",
        data: arr,
      });
    } catch (error) {
      res.send({
        message: error,
        status: 500,
      });
    }
  });
});

module.exports = router;
