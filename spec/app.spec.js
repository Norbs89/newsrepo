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
    describe("/comments", () => {
      it("POST: 201 - Inserts both the body and the username into the comments table based on the post request, responds with the posted comment", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .send({
            username: "icellusedkars",
            body: "test comment"
          })
          .expect(201)
          .then(res => {
            expect(res.body).to.be.an("object");
            expect(res.body).to.eql({ comment: "test comment" });
          });
      });
      it("POST: 400 - Throws an error when the new comment request has an undefined value", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .send({
            username: undefined,
            body: "test comment"
          })
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal(
              "Value is missing or invalid data type"
            );
          });
      });
      it("POST: 400 - Throws an error when the new comment has an invalid value", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .send({
            username: "notValidUser",
            body: "test comment"
          })
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal(
              "Value is missing or invalid data type"
            );
          });
      });
      it("POST: 400 - Throws an error when the new comment has a missing key", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .send({
            username: "icellusedkars"
          })
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal(
              "Value is missing or invalid data type"
            );
          });
      });
    });
    it("GET: 200 - Responds with an article object with all article tables as properties plus an added 'comment_count' property that comes from comments", () => {
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
    it("PATCH: 404 - Throws an error when the patch request has been sent to a non existent article", () => {
      return request(app)
        .patch("/api/articles/9999")
        .send({ inc_votes: 15 })
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal("404, Not found!");
        });
    });
    it("PATCH: 400 - Throws an error when the patch request is trying to patch a wrong article key", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ topic: 15 })
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
