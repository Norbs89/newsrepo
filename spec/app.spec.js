process.env.NODE_ENV = "test";
const request = require("supertest");
const chai = require("chai");
const { expect } = chai;
const app = require("../app");
const connection = require("../db/connection");

describe("/api", () => {
  after(() => connection.destroy());
  beforeEach(() => {
    return connection.seed.run();
  });
  describe("/topics", () => {
    it("GET:200 - Responds with an object containing an array of topics, each having 'slug' & 'description' properties", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an("object");
          res.body.topics.forEach(topic => {
            expect(topic).to.contain.keys("slug", "description");
          });
        });
    });
  });
  describe("/users/:username", () => {
    it("GET:200 - Responds with a user object which should have the following properties: username, avatar_url, name", () => {
      return request(app)
        .get("/api/users/icellusedkars")
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an("object");
          expect(res.body.user[0]).to.contain.keys(
            "username",
            "avatar_url",
            "name"
          );
          expect("icellusedkars").to.equal(res.body.user[0].username);
        });
    });
  });
  describe("/articles/:article_id", () => {
    it("GET:200 - Responds with an article object with all article tables as properties plus an added 'comment_count' property that comes from comments", () => {
      return request(app)
        .get("/api/articles/1")
        .then(res => {
          expect(res.body).to.be.an("object");
          expect(res.body.article[0]).to.contain.keys(
            "article_id",
            "author",
            "title",
            "body",
            "topic",
            "created_at",
            "votes",
            "comment_count"
          );
          expect(res.body.article[0].article_id).to.equal(1);
        });
    });
    it("PATCH:201 - Responds with an article object with the updated votes number, based on the received PATCH request", () => {});
  });
});
