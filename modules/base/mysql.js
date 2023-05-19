const mysql = require("mysql");
function connect() {
  return mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "112233",
    database: "linkinsense",
    port: 3306,
  });
}

function querySql(sql) {
  const conn = connect();
  return new Promise((resolve, reject) => {
    try {
      conn.query(sql, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    } catch (e) {
      reject(e);
    } finally {
      // 释放连接,保持链接下次查询会报错
      conn.end();
    }
  });
}


module.exports = {  querySql };
