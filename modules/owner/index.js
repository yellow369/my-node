const { Router } = require("express");
const router = Router();
const { querySql } = require("../base/mysql");

//  货主分页
router.get("/owner/page", async function (req, res) {
  let query = `select * from owner WHERE (name LIKE '%${req.query.searchWord}%' OR id LIKE '%${
    req.query.searchWord
  }%') LIMIT ${(req.query.pageIndex - 1) * req.query.pageSize},${
    req.query.pageSize
  }`;
  let queryTotal = `select count(*) AS total from owner WHERE (name LIKE '%${req.query.searchWord}%' OR id LIKE '%${req.query.searchWord}%')`;

  try {
    const data = await querySql(query);
    let tableData = data;
   
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

// 修改货主状态
router.post("/owner/status/:id", async function (req, res) {
  let query = `update owner set status = status ^ 1 where id = ${req.params.id}`
  try {
    querySql(query).then(data => {
      res.send({
        status: 200,
        message: "OK",
        data
      });
    })
   
  } catch (error) {
    res.send(500, {
      message: error.stack,
      status: 500,
    });
  }
});

// 货主的项目分页
router.get("/owner/project/page", async function (req, res) {
  let query = `select * from user_project WHERE (ownerId = ${  req.query.ownerId} and 
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

// 货主的合同分页
router.get("/owner/contract/page", async function (req, res) {
  let query = `select * from contract WHERE (ownerId = ${  req.query.ownerId } and 
    (name LIKE '%${req.query.searchWord}%' OR code LIKE '%${
    req.query.searchWord
  }%' OR company LIKE '%${req.query.searchWord}%')) LIMIT ${
    (req.query.pageIndex - 1) * req.query.pageSize
  },${req.query.pageSize}`;
  let queryTotal = `select count(*) AS total from contract WHERE (name LIKE '%${req.query.searchWord}%' OR code LIKE '%${req.query.searchWord}%' OR company LIKE '%${
    req.query.searchWord
  }%')`;

  try {
    const data = await querySql(query);
    let tableData = data;
   
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

// 货主的账号分页
router.get("/owner/account/page", async function (req, res) {
  let query = `select * from user WHERE (ownerId = ${  req.query.ownerId } and 
    (name LIKE '%${req.query.searchWord}%' OR account LIKE '%${
    req.query.searchWord
  }%' OR company LIKE '%${req.query.searchWord}%')) LIMIT ${
    (req.query.pageIndex - 1) * req.query.pageSize
  },${req.query.pageSize}`;
  let queryTotal = `select count(*) AS total from user WHERE (name LIKE '%${req.query.searchWord}%' OR account LIKE '%${req.query.searchWord}%' OR company LIKE '%${
    req.query.searchWord
  }%')`;

  try {
    const data = await querySql(query);
    let tableData = data;
   
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
