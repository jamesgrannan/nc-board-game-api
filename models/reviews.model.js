const db = require("../db/connection");

exports.fetchReview = (id) => {
  return db
    .query(
      `SELECT (title, review_body, designer, review_img_url, votes, category, owner, created_at, 
      SUM(comments.review_id) 
      AS (comment_count)) 
      FROM reviews 
      INNER JOIN comments 
      ON comments.review_id = reviews.review_id
      WHERE review_id = $1`,
      [id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No review found at review_id: ${id}`,
        });
      }
      console.log(rows);
      return rows;
    });
};
