const request = require("supertest");
const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const app = require("../app");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api", () => {
  test("STATUS: 200, respond with JSON object", async () => {
    const { body } = await request(app).get("/api").expect(200);
    expect(typeof body).toEqual("object");
    expect(body.endpoints).toEqual({
      "GET /api": {
        description:
          "serves up a json representation of all the available endpoints of the api",
      },
      "GET /api/categories": {
        description: "serves an array of all categories",
        queries: [],
        exampleResponse: {
          categories: [
            {
              description:
                "Players attempt to uncover each other's hidden role",
              slug: "Social deduction",
            },
          ],
        },
      },
      "GET /api/reviews": {
        description: "serves an array of all reviews",
        queries: ["category", "sort_by", "order"],
        exampleResponse: {
          reviews: [
            {
              title: "One Night Ultimate Werewolf",
              designer: "Akihisa Okui",
              owner: "happyamy2016",
              review_img_url:
                "https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
              category: "hidden-roles",
              created_at: 1610964101251,
              votes: 5,
            },
          ],
        },
      },
    });
  });
});

describe("GET /api/categories", () => {
  test("STATUS: 200, respond with array of all the slugs and descriptions", async () => {
    const { body } = await request(app).get("/api/categories").expect(200);
    expect(typeof body).toBe("object");
    expect(body).not.toBeInstanceOf(Array);
    expect(body.categories).toEqual([
      {
        slug: "euro game",
        description: "Abstact games that involve little luck",
      },
      {
        slug: "social deduction",
        description: "Players attempt to uncover each other's hidden role",
      },
      { slug: "dexterity", description: "Games involving physical skill" },
      { slug: "children's games", description: "Games suitable for children" },
    ]);
  });
});

describe("GET /api/reviews/:review_id", () => {
  test("STATUS: 200, responds with correct review", async () => {
    const { body } = await request(app).get("/api/reviews/2").expect(200);
    expect(body).toBeInstanceOf(Object);
    expect(body.review).toHaveLength(1);
    expect(body.review[0]).toEqual(
      expect.objectContaining({
        title: "Jenga",
        designer: "Leslie Scott",
        owner: "philippaclaire9",
        review_img_url:
          "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
        review_body: "Fiddly fun for all the family",
        category: "dexterity",
        created_at: expect.any(String),
        votes: 5,
        review_id: 2,
        comment_count: "3",
      })
    );
  });

  test("STATUS: 400, bad id", async () => {
    const { body } = await request(app)
      .get("/api/reviews/NO_ENTRY")
      .expect(400);
    expect(body).toEqual({ msg: "Invalid input" });
  });

  test("STATUS: 404, id doesn't exist", async () => {
    const { body } = await request(app).get("/api/reviews/5000").expect(404);
    expect(body).toEqual({ msg: "No review found at review_id: 5000" });
  });
});

describe("PATCH /api/reviews/:review_id", () => {
  test("STATUS: 200, responds with updated review when adding reviews", async () => {
    const votes = { inc_votes: 3 };
    const { body } = await request(app)
      .patch("/api/reviews/2")
      .send(votes)
      .expect(200);
    expect(body.review[0]).toEqual(
      expect.objectContaining({
        title: "Jenga",
        designer: "Leslie Scott",
        owner: "philippaclaire9",
        review_img_url:
          "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
        review_body: "Fiddly fun for all the family",
        category: "dexterity",
        created_at: expect.any(String),
        votes: 8,
        review_id: 2,
      })
    );
  });
  test("STATUS: 200, responds with updated review when subtracting reviews", async () => {
    const votes = { inc_votes: -4 };
    const { body } = await request(app)
      .patch("/api/reviews/2")
      .send(votes)
      .expect(200);
    expect(body.review[0]).toEqual(
      expect.objectContaining({
        title: "Jenga",
        designer: "Leslie Scott",
        owner: "philippaclaire9",
        review_img_url:
          "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
        review_body: "Fiddly fun for all the family",
        category: "dexterity",
        created_at: expect.any(String),
        votes: 1,
        review_id: 2,
      })
    );
  });

  test("STATUS: 400, bad id", async () => {
    const votes = { inc_votes: 10 };
    const { body } = await request(app)
      .patch("/api/reviews/NO_ENTRY")
      .send(votes)
      .expect(400);
    expect(body).toEqual({ msg: "Invalid input" });
  });

  test("STATUS: 404, id doesn't exist", async () => {
    const votes = { inc_votes: 10 };
    const { body } = await request(app)
      .patch("/api/reviews/500")
      .send(votes)
      .expect(404);
    expect(body).toEqual({ msg: "No review found at review_id: 500" });
  });

  test("STATUS: 400, no votes on the request body", async () => {
    const votes = { not_inc_votes: 1 };
    const { body } = await request(app)
      .patch("/api/reviews/14")
      .send(votes)
      .expect(400);
    expect(body).toEqual({ msg: "Invalid input" });
  });

  test("STATUS: 400, invalid votes value", async () => {
    const votes = { inc_votes: "string" };
    const { body } = await request(app)
      .patch("/api/reviews/10")
      .send(votes)
      .expect(400);
    expect(body).toEqual({ msg: "Invalid input" });
  });

  test("STATUS: 400, included other information", async () => {
    const votes = { inc_votes: 2, hello: "world" };
    const { body } = await request(app)
      .patch("/api/reviews/11")
      .send(votes)
      .expect(400);
    expect(body).toEqual({ msg: "Invalid input" });
  });
});

describe("GET api/reviews", () => {
  test("STATUS: 200, respond with all reviews", async () => {
    const { body } = await request(app).get("/api/reviews").expect(200);
    expect(body.reviews).toHaveLength(13);
    body.reviews.forEach((review) =>
      expect(review).toEqual(
        expect.objectContaining({
          title: expect.any(String),
          owner: expect.any(String),
          review_id: expect.any(Number),
          review_img_url: expect.any(String),
          review_body: expect.any(String),
          category: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          comment_count: expect.any(String),
        })
      )
    );
  });

  test("STATUS: 200, respond with sorted reviews when requested to with sort_by query", async () => {});
});
