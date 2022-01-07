const db = require("../db/connection");
const format = require("pg-format");

const checkDatabase = async (table, column, value, msg, exists = false) => {
  const searchQuery = format(`SELECT * FROM %I WHERE %I = $1`, table, column);
  const searchOutput = await db.query(searchQuery, [value]);
  if (searchOutput.rows.length === 0) {
    return exists
      ? searchOutput.rows
      : Promise.reject({ status: 404, msg: msg });
  }

  return exists ? Promise.reject({ status: 400, msg: msg }) : searchOutput.rows;
};

module.exports = checkDatabase;
