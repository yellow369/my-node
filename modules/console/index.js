const { Router } = require("express");
const router = Router();
const { querySql } = require("../base/mysql");

// status  0:在线  1:离线 2:异常
// type  0:PDA 1:网关 2:电子位签 3:AGV
router.get("/console/device", function (req, res) {
  let query = `select * from device `;
  querySql(query).then((data) => {
    try {
      return res.send({
        status: 200,
        message: "OK",
        data: data,
      });
    } catch (error) {
      res.send({
        message: error,
        status: 500,
      });
    }
  });
});

// 我的项目列表
router.get("/console/project", async function (req, res) {
  let query = `select * from user_project where userId = ${req.query.userId}`;
  query += req.query.limit ? ` limit 0,${req.query.limit}` : "";
  try {
    const data = await querySql(query);
    let tableData = data;
    for (let i = 0; i < tableData.length; i++) {
      if (tableData[i].goods) {
        let goodsArr = tableData[i].goods.split(",");
        let goodsList = [];
        for (let j = 0; j < goodsArr.length; j++) {
          let queryGoods = `select * from goods where id = ${goodsArr[j]}`;
          const val = await querySql(queryGoods);
          val ? goodsList.push(val[0]) : "";
        }
        goodsList.map((item, index) => {
          goodsList[index] = item.name;
        });
        goodsList = goodsList.join("、");
        tableData[i].goods = goodsList;
      }
    }

    res.send({
      status: 200,
      message: "OK",
      data: tableData,
    });
  } catch (error) {
    res.send(500, {
      message: error.stack,
      status: 500,
    });
  }
});
// 我的项目分页
router.get("/console/project/page", async function (req, res) {
  let query = `select * from user_project WHERE (userId = ${  req.query.userId} and 
    (name LIKE '%${req.query.searchWord}%' OR mark LIKE '%${
    req.query.searchWord
  }%' OR id LIKE '%${req.query.searchWord}%')) LIMIT ${
    (req.query.pageIndex - 1) * req.query.pageSize
  },${req.query.pageSize}`;
  let queryTotal = `select count(*) AS total from user_project WHERE (name LIKE '%${req.query.searchWord}%' OR mark LIKE '%${req.query.searchWord}%' OR id LIKE '%${
    req.query.searchWord
  }%')`;

  try {
    const data = await querySql(query);
    let tableData = data;
    for (let i = 0; i < tableData.length; i++) {
      if (tableData[i].goods) {
        let goodsArr = tableData[i].goods.split(",");
        let goodsList = [];
        for (let j = 0; j < goodsArr.length; j++) {
          let queryGoods = `select * from goods where id = ${goodsArr[j]}`;
          const val = await querySql(queryGoods);
          val ? goodsList.push(val[0]) : "";
        }
        goodsList.map((item, index) => {
          goodsList[index] = item.name;
        });
        goodsList = goodsList.join("、");
        tableData[i].goods = goodsList;
      }
    }
    const total = await querySql(queryTotal);
    res.send({
      status: 200,
      message: "OK",
      data: tableData,
      total: total[0].total,
    });
  } catch (error) {
    res.send(500, {
      message: error.stack,
      status: 500,
    });
  }
});

module.exports = router;
