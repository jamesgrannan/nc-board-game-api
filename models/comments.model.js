const db = require("../db/connection");
const checkDatabase = require("./utils.model");

exports.removeComment = (id) => {
  return db
    .query(`SELECT * FROM comments WHERE comment_id = $1`, [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No comment found at comment_id: ${id}`,
        });
      }
    })
    .then(() => {
      return db.query(
        `DELETE FROM comments
    WHERE comment_id = $1`,
        [id]
      );
    });
};

exports.updateComment = async (id, update) => {
  if (typeof update.inc_votes === "string" || Object.keys(update).length > 1) {
    return Promise.reject({
      code: "22P02",
    });
  }
  if (!Object.keys(update).includes("inc_votes")) {
    const comment = await db.query(
      `SELECT * FROM COMMENTS WHERE comment_id = $1`,
      [id]
    );
    return comment.rows[0];
  }
  const searchDb = await db.query(
    `UPDATE comments
  SET votes = votes + $1
  WHERE comment_id = $2
  RETURNING *;`,
    [update.inc_votes, id]
  );
  if (searchDb.rows.length === 0) {
    const check = await checkDatabase(
      "comments",
      "comment_id",
      id,
      `No comment found at comment_id: ${id}`
    );
  }
  return searchDb.rows[0];
};
