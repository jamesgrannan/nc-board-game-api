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
    const { body } = await request(app).get("/api/reviews/5").expect(200);
    expect(body).toBeInstanceOf(Object);
    expect(body.review).toHaveLength(1);
    expect(body.review[0]).toEqual(
      expect.objectContaining({
        title: expect.any(String),
        designer: expect.any(String),
        owner: expect.any(String),
        review_img_url: expect.any(String),
        review_body: expect.any(String),
        category: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
      })
    );
  });

  test("STATUS: 400, responds with 400 error", async () => {
    const { body } = await request(app)
      .get("/api/reviews/NO_ENTRY")
      .expect(400);
    expect(body).toEqual({ msg: "Invalid input" });
  });

  test("STATUS: 404, responds with 404 error", async () => {
    const { body } = await request(app).get("/api/reviews/5000").expect(404);
    expect(body).toEqual({ msg: "No review found at review_id: 5000" });
  });
});
