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
    it("405 Not Allowed - sends a 405 status error when trying to use invalid methods", () => {
      return request(app)
        .delete("/api/topics")
        .expect(405)
        .then(res => {
          expect(res.body.msg).to.equal("Method not allowed!");
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
    it("GET: 404 - responds with error message when given a username that doesn't exist", () => {
      return request(app)
        .get("/api/users/clearlyAWrongUsername")
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal("404, Not found!");
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
    it("GET: 400 - responds with error message when the requested article_id input is an invalid input type", () => {
      return request(app)
        .get("/api/articles/notAnArticleId")
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal("Invalid request");
        });
    });
    it("GET: 404 - responds with error message when given an article_id that doesn't exist", () => {
      return request(app)
        .get("/api/articles/99999")
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal("404, Not found!");
        });
    });
    it("PATCH:200 - Responds with an article object with the updated votes, based on the received PATCH request", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 10 })
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an("object");
          expect(res.body.article[0].votes).to.equal(110);
        });
    });
    it("PATCH:200 - the request works for negative numbers too", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: -10 })
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an("object");
          expect(res.body.article[0].votes).to.equal(90);
        });
    });
    it("PATCH: 400 - Throws an error when the patch request has an invalid value", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: "banana" })
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal("Invalid request");
        });
    });
  });
  describe("Invalid Path", () => {
    it("sends a 404 when given a non-existent path", () => {
      return request(app)
        .get("/api/path-does-not-exist")
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal("Route not found!");
        });
    });
  });
});
