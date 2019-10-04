import mysql, { MysqlError } from "mysql";
const config = {
  host: "localhost",
  user: "root",
  password: "sandamiano",
  database: "pickpiki_db"
};
// creating a mysql pool
const pool = mysql.createPool(config);

function executeQuery(
  sql: string,
  callback: (error: MysqlError | any, results: any) => any
) {
  pool.getConnection((error, connection) => {
    if (error) {
      return callback(error, null);
    } else {
      if (connection) {
        connection.query(sql, (error, results, fields) => {
          connection.release();
          if (error) {
            return callback(error, null);
          } else {
            return callback(null, results);
          }
        });
      }
    }
  });
}
function query(
  sql: string,
  callback: (error: MysqlError | any, results?: any) => void
) {
  executeQuery(sql, (err, data) => {
    if (err) {
      return callback(err);
    } else {
      callback(null, data);
    }
  });
}

export { query as default, config };
