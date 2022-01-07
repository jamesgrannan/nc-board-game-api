const db = require("../db/connection");
const checkDatabase = require("./utils.model");

exports.fetchCategories = () => {
  return db.query(`SELECT * FROM categories;`).then(({ rows }) => {
    return rows;
  });
};

exports.createCategory = async (post) => {
  if (post.slug && post.description) {
    const check = await checkDatabase(
      "categories",
      "slug",
      post.slug,
      "Category already exists",
      true
    );
  } else {
    return Promise.reject({
      status: 400,
      msg: "Invalid input",
    });
  }
  const { slug, description } = post;
  const postingCategory = await db.query(
    `INSERT INTO categories
  (slug, description)
  VALUES
  ($1, $2)
  RETURNING *;`,
    [slug, description]
  );
  const { rows } = postingCategory;
  return rows[0];
};
