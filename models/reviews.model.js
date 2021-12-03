const db = require("../db/connection");

exports.fetchReview = (id) => {
  return db
    .query(
      `SELECT title, review_body, designer, review_img_url, reviews.votes, 
      category, owner, reviews.created_at, reviews.review_id, 
      COUNT(comments.review_id) 
      AS comment_count 
      FROM reviews 
      LEFT JOIN comments 
      ON comments.review_id = reviews.review_id
      WHERE reviews.review_id = $1
      GROUP BY reviews.review_id;`,
      [id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No review found at review_id: ${id}`,
        });
      }
      return rows[0];
    });
};

exports.updateReview = (id, update) => {
  if (
    !update.inc_votes ||
    typeof update.inc_votes === "string" ||
    Object.keys(update).length > 1
  ) {
    return Promise.reject({
      code: "22P02",
    });
  }
  return db
    .query(
      `UPDATE reviews
  SET votes = votes + $1
  WHERE review_id = $2
  RETURNING *;`,
      [update.inc_votes, id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No review found at review_id: ${id}`,
        });
      }
      return rows[0];
    });
};

exports.fetchAllReviews = ({
  sort_by = "created_at",
  order = "DESC",
  category,
}) => {
  const queryValues = [];
  if (
    ![
      "title",
      "owner",
      "review_id",
      "category",
      "created_at",
      "votes",
      "comment_count",
    ].includes(sort_by)
  ) {
    return Promise.reject({ status: 400, msg: "Invalid sort query" });
  }
  if (!["ASC", "DESC"].includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid order query" });
  }
  let queryStr = `SELECT title, owner, reviews.review_id, review_img_url, review_body, category, reviews.created_at, reviews.votes,
  COUNT(comments.review_id)
  AS comment_count
  FROM reviews
  LEFT JOIN comments
  ON comments.review_id = reviews.review_id`;

  const categoryList = [
    "euro game",
    "social deduction",
    "dexterity",
    "children's games",
    "strategy",
    "hidden-roles",
    "push-your-luck",
    "roll-and-write",
    "deck-building",
    "engine-building",
  ];

  let cat = typeof category === "string" ? [category] : category || [null];

  if (cat.every((element) => categoryList.includes(element))) {
    for (let i = 0; i < cat.length; i++) {
      if (queryValues.length) {
        queryStr += " OR";
      } else {
        queryStr += " WHERE";
      }
      queryValues.push(cat[i]);
      queryStr += ` category = $${queryValues.length}`;
    }
  }
  queryStr += ` GROUP BY reviews.review_id ORDER BY ${sort_by} ${order};`;

  return db.query(queryStr, queryValues).then(({ rows }) => rows);
};

exports.fetchComments = (id) => {
  return db
    .query(
      `SELECT *
FROM comments
LEFT JOIN reviews
ON reviews.review_id = comments.review_id
WHERE comments.review_id = $1;`,
      [id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return db
          .query(`SELECT * FROM reviews WHERE review_id = $1`, [id])
          .then(({ rows }) => {
            if (rows.length > 0) {
              return Promise.reject({
                status: 404,
                msg: "No comments on this review",
              });
            }

            return Promise.reject({
              status: 404,
              msg: `No review found at review_id: ${id}`,
            });
          });
      }
      return rows;
    });
};

exports.createComment = (post, id) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1`, [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No review found at review_id: ${id}`,
        });
      }
    })
    .then(() => {
      const { username, body } = post;
      return db
        .query(
          `INSERT INTO comments
  (author, body, review_id)
  VALUES
  ($1, $2, $3)
  RETURNING *;`,
          [username, body, id]
        )
        .then(({ rows }) => {
          if (rows.length === 0) {
            return Promise.reject({
              status: 404,
              msg: `No review found at review_id: ${id}`,
            });
          }
          return rows[0];
        });
    });
};
