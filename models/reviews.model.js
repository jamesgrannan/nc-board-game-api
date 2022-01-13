const db = require("../db/connection");
const checkDatabase = require("./utils.model");

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

exports.updateReview = async (id, update) => {
  if (typeof update.inc_votes === "string" || Object.keys(update).length > 1) {
    return Promise.reject({
      code: "22P02",
    });
  }
  if (!Object.keys(update).includes("inc_votes")) {
    const review = await db.query(
      `SELECT * FROM REVIEWS WHERE review_id = $1`,
      [id]
    );
    return review.rows[0];
  }
  const searchDb = await db.query(
    `UPDATE reviews
  SET votes = votes + $1
  WHERE review_id = $2
  RETURNING *;`,
    [update.inc_votes, id]
  );
  if (searchDb.rows.length === 0) {
    const check = await checkDatabase(
      "reviews",
      "review_id",
      id,
      `No review found at review_id: ${id}`
    );
  }
  return searchDb.rows[0];
};

exports.fetchAllReviews = async ({
  sort_by = "created_at",
  order = "DESC",
  category,
  limit = 10,
  p = 1,
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
  if (isNaN(limit)) {
    return Promise.reject({ status: 400, msg: "Invalid limit query" });
  }
  if (isNaN(p)) {
    return Promise.reject({ status: 400, msg: "Invalid p query" });
  }
  if (typeof category === "object") {
    category.forEach(async (cat) => {
      const checkCategory = await checkDatabase(
        "categories",
        "slug",
        cat,
        "Category not found"
      );
    });
  }
  if (typeof category === "string") {
    const checkCategory = await checkDatabase(
      "categories",
      "slug",
      category,
      "Category not found"
    );
  }
  const offset = (p - 1) * limit;

  let queryStr = `SELECT title, owner, reviews.review_id, review_img_url, review_body, category, reviews.created_at, reviews.votes,
  COUNT(comments.review_id)
  AS comment_count
  FROM reviews
  LEFT JOIN comments
  ON comments.review_id = reviews.review_id`;

  let cat = typeof category === "string" ? [category] : category;
  if (cat) {
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
  queryStr += ` GROUP BY reviews.review_id `;
  const noPagination = await db.query(queryStr, queryValues);
  const total = noPagination.rows.length;

  queryStr += `ORDER BY ${sort_by} ${order} LIMIT ${limit} OFFSET ${offset};`;

  const query = await db.query(queryStr, queryValues);
  return query.rows.length === 0
    ? Promise.reject({ status: 404, msg: "No results to display on this page" })
    : { reviews: query.rows, total_count: total };
};

exports.fetchComments = async (id, { limit = 10, p = 1 }) => {
  if (isNaN(limit)) {
    return Promise.reject({ status: 400, msg: "Invalid limit query" });
  }
  if (isNaN(p)) {
    return Promise.reject({ status: 400, msg: "Invalid p query" });
  }
  const offset = (p - 1) * limit;

  const noPagination = await db.query(
    `SELECT *
  FROM comments
  LEFT JOIN reviews
  ON reviews.review_id = comments.review_id
  WHERE comments.review_id = $1;`,
    [id]
  );
  const total = noPagination.rows.length || 0;
  const commentQuery = await db.query(
    `SELECT comment_id, comments.votes, author, comments.created_at, body
FROM comments
LEFT JOIN reviews
ON reviews.review_id = comments.review_id
WHERE comments.review_id = $1
LIMIT ${limit}
OFFSET ${offset};`,
    [id]
  );
  const { rows } = commentQuery;
  if (rows.length === 0) {
    const check = await checkDatabase(
      "reviews",
      "review_id",
      id,
      `No review found at review_id: ${id}`
    );

    return p > 1
      ? Promise.reject({
          status: 404,
          msg: "No results to display on this page",
        })
      : Promise.reject({
          status: 404,
          msg: "No comments on this review",
        });
  }

  return { comments: rows, total_count: total };
};

exports.createComment = async (post, id) => {
  const checkReviews = await db
    .query(`SELECT * FROM reviews WHERE review_id = $1`, [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No review found at review_id: ${id}`,
        });
      }
    });
  if (post.username) {
    const check = await checkDatabase(
      "users",
      "username",
      post.username,
      "Username doesn't exist"
    );
  }
  const { username, body } = post;
  const postingReview = await db.query(
    `INSERT INTO comments
  (author, body, review_id)
  VALUES
  ($1, $2, $3)
  RETURNING *;`,
    [username, body, id]
  );
  const { rows } = postingReview;
  if (rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: `No review found at review_id: ${id}`,
    });
  }
  return rows[0];
};

exports.removeReview = (id) => {
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
      return db.query(
        `DELETE FROM reviews
    WHERE review_id = $1`,
        [id]
      );
    });
};

exports.createReview = async (post) => {
  if (
    post.owner &&
    post.title &&
    post.review_body &&
    post.designer &&
    post.category
  ) {
    const check1 = await checkDatabase(
      "users",
      "username",
      post.owner,
      "Owner not found"
    );

    const check2 = await checkDatabase(
      "categories",
      "slug",
      post.category,
      "Category not found"
    );
  } else {
    return Promise.reject({
      status: 400,
      msg: "Invalid input",
    });
  }
  const { owner, title, review_body, designer, category } = post;
  const postingReview = await db.query(
    `INSERT INTO reviews
  (owner, title, review_body, designer, category)
  VALUES
  ($1, $2, $3, $4, $5)
  RETURNING *;`,
    [owner, title, review_body, designer, category]
  );
  const { rows } = postingReview;
  rows[0].comment_count = 0;
  delete rows[0].review_img_url;
  return rows[0];
};
