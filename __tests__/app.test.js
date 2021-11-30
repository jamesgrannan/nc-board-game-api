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
    expect(Array.isArray(body)).toBe(false);
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
  test("STATUS: 200 responds with correct review", async () => {
    const { body } = await request(app).get("/api/reviews/5").status(200);
    expect(body.review).toEqual({
      title: "Proident tempor et.",
      designer: "Seymour Buttz",
      owner: "mallionaire",
      review_img_url:
        "https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg",
      review_body:
        "Labore occaecat sunt qui commodo anim anim aliqua adipisicing aliquip fugiat. Ad in ipsum incididunt esse amet deserunt aliqua exercitation occaecat nostrud irure labore ipsum. Culpa tempor non voluptate reprehenderit deserunt pariatur cupidatat aliqua adipisicing. Nostrud labore dolor fugiat sint consequat excepteur dolore irure eu. Anim ex adipisicing magna deserunt enim fugiat do nulla officia sint. Ex tempor ut aliquip exercitation eiusmod. Excepteur deserunt officia voluptate sunt aliqua esse deserunt velit. In id non proident veniam ipsum id in consequat duis ipsum et incididunt. Qui cupidatat ea deserunt magna proident nisi nulla eiusmod aliquip magna deserunt fugiat fugiat incididunt. Laboris nisi velit mollit ullamco deserunt eiusmod deserunt ea dolore veniam.",
      category: "social deduction",
      created_at: new Date(1610010368077),
      votes: 5,
    });
  });
});
