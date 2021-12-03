const db = require("../db/connection");

exports.removeComment = (id) => {
  return db
    .query(`SELECT * FROM comments WHERE comment_id = $1`, [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No review found at review_id: ${id}`,
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
