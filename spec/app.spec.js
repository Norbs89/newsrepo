process.env.NODE_ENV = "test";
const request = require("supertest");
const chai = require("chai");
const chaiSorted = require("sams-chai-sorted");
const { expect } = chai;
chai.use(chaiSorted);
const app = require("../app");
const connection = require("../db/connection");

describe("/api", () => {
  after(() => connection.destroy());
  beforeEach(() => {
    return connection.seed.run();
  });
  it("Responds with a JSON describing all endpoints on API", () => {
    request(app)
      .get("/api")
      .expect(200)
      .then(res => {
        expect(res).to.be.an("object");
      });
  });
  describe("/comments", () => {
    describe("/:comment_id", () => {
      it("PATCH:200 - Responds with an article object with the updated votes, based on the received PATCH request", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: 10 })
          .expect(200)
          .then(res => {
            expect(res.body).to.be.an("object");
            expect(res.body.comment.votes).to.equal(26);
          });
      });
      it("PATCH: 200 - Ignore the patch request that has no information in the request body and send back the unchanged article", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({})
          .expect(200)
          .then(res => {
            expect(res.body).to.be.an("object");
            expect(res.body.comment.votes).to.equal(16);
          });
      });
      it("PATCH:200 - the request works for negative numbers too", () => {
        return request(app)
          .patch("/api/comments/2")
          .send({ inc_votes: -10 })
          .expect(200)
          .then(res => {
            expect(res.body).to.be.an("object");
            expect(res.body.comment.votes).to.equal(4);
          });
      });
      it("PATCH: 400 - Throws an error when the patch request has an invalid value", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: "banana" })
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal("Invalid request");
          });
      });
      it("PATCH: 404 - Throws an error when the patch request has been sent to a non existent comment", () => {
        return request(app)
          .patch("/api/comments/99999")
          .send({ inc_votes: 15 })
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.equal("404, Not found!");
          });
      });
      it("PATCH: 400 - Throws an error when the patch request is trying to patch a wrong article key", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ body: 15 })
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal("Invalid request");
          });
      });
      it("DELETE: 204 - Delete a comment specified by the parameter(comment_id)", () => {
        return request(app)
          .delete("/api/comments/1")
          .expect(204);
      });
      it("DELETE: 404 - Throws an error when trying to delete a non existent comment", () => {
        return request(app)
          .delete("/api/comments/99999")
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.equal("404, Not found!");
          });
      });
    });
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
          expect(res.body.user).to.contain.keys(
            "username",
            "avatar_url",
            "name"
          );
          expect("icellusedkars").to.equal(res.body.user.username);
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
  describe("/articles", () => {
    it("GET: 200 - Responds with all articles,by default it's sorted by date, ordered by descending order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an("object");
          expect(res.body.articles[0]).to.contain.keys(
            "author",
            "title",
            "article_id",
            "topic",
            "created_at",
            "votes",
            "comment_count"
          );
          expect(res.body.articles).to.be.sortedBy("created_at", {
            descending: true
          });
        });
    });
    it("GET: 200 - Responds with all articles, sorted by author, ordered by descending order", () => {
      return request(app)
        .get("/api/articles?sort_by=author")
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an("object");
          expect(res.body.articles[0]).to.contain.keys(
            "author",
            "title",
            "article_id",
            "topic",
            "created_at",
            "votes",
            "comment_count"
          );
          expect(res.body.articles).to.be.sortedBy("author", {
            descending: true
          });
        });
    });
    it("GET: 200 - Responds with all articles, ordered by ascending order", () => {
      return request(app)
        .get("/api/articles?order=asc")
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an("object");
          expect(res.body.articles[0]).to.contain.keys(
            "author",
            "title",
            "article_id",
            "topic",
            "created_at",
            "votes",
            "comment_count"
          );
          expect(res.body.articles).to.be.sortedBy("created_at", {
            descending: false
          });
        });
    });
    it("GET: 200 - Responds with all articles with added 'comment_count' key-value pair. It can accept queries", () => {
      return request(app)
        .get("/api/articles?sort_by=votes")
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an("object");
          expect(res.body.articles[0]).to.contain.keys(
            "author",
            "title",
            "article_id",
            "topic",
            "created_at",
            "votes",
            "comment_count"
          );
          expect(res.body.articles).to.be.sortedBy("votes", {
            descending: true
          });
        });
    });
    it("GET: 200 - responds with the filtered articles, specified by user query", () => {
      return request(app)
        .get("/api/articles?author=butter_bridge")
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an("object");
          res.body.articles.forEach(articles =>
            expect(articles.author).to.eql("butter_bridge")
          );
        });
    });
    it("GET: 200 - responds with the filtered articles, specified by user query", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an("object");
          res.body.articles.forEach(articles =>
            expect(articles.topic).to.eql("mitch")
          );
        });
    });
    it("GET: 400 - responds with error message when trying to sort by an invalid query", () => {
      return request(app)
        .get("/api/articles?sort_by=banana")
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal("Invalid query");
        });
    });
    it("GET: 404 - responds with error message when given a filter value that doesn't exist", () => {
      return request(app)
        .get("/api/articles?author=banana")
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal("404, Not found!");
        });
    });
    it("GET: 200 - responds with a 200 OK when given a filter value that's valid but does not have any articles associated with it", () => {
      return request(app)
        .get("/api/articles?author=lurker")
        .expect(200)
        .then(res => {
          expect(res.body.articles).to.eql([]);
        });
    });
    it("GET: 200 - responds with a 200 OK when given a filter value that's valid but does not have any articles associated with it", () => {
      return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then(res => {
          expect(res.body.articles).to.eql([]);
        });
    });
    it("POST: 201 - Posts a new article with the correct key value pairs.", () => {
      return request(app)
        .post("/api/articles")
        .send({
          title: "A new article",
          body: "test article posted",
          topic: "mitch",
          author: "icellusedkars"
        })
        .expect(201)
        .then(res => {
          expect(res.body).to.be.an("object");
          expect(res.body.article).to.have.keys(
            "article_id",
            "author",
            "title",
            "topic",
            "votes",
            "created_at",
            "body"
          );
          expect(res.body.article.body).to.eql("test article posted");
        });
    });
    it("POST: 400 - Throws an error when the new article request has an undefined value", () => {
      return request(app)
        .post("/api/articles")
        .send({
          title: undefined,
          body: "test article posted",
          topic: "mitch",
          author: "icellusedkars"
        })
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal(
            "Value is missing or invalid data type"
          );
        });
    });
    it("POST: 400 - Throws an error when the new article has an invalid value", () => {
      return request(app)
        .post("/api/articles")
        .send({
          title: "NEW ARTICLE",
          body: "test article posted",
          topic: "mitch",
          author: "NotAValidUser"
        })
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal(
            "Value is missing or invalid data type"
          );
        });
    });
    it("POST: 400 - Throws an error when the new article has a missing key", () => {
      return request(app)
        .post("/api/articles")
        .send({
          title: "NEW ARTICLE",
          body: "test article posted",
          topic: "mitch"
        })
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal(
            "Value is missing or invalid data type"
          );
        });
    });
    describe("/:article_id", () => {
      describe("/comments", () => {
        it("GET: 200 - Responds with all comments for the given article_id. Can accept queries - be sorted by any column as well as order by asc or desc(default)", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=author")
            .expect(200)
            .then(res => {
              expect(res.body).to.be.an("object");
              expect(res.body.comments).to.be.sortedBy("author", {
                descending: true
              });
              expect(res.body.comments[0]).to.contain.keys(
                "comment_id",
                "votes",
                "created_at",
                "author",
                "body"
              );
            });
        });
        it("GET: 200 - Responds with a 200 OK for the given article_id, even if the article has no comments.", () => {
          return request(app)
            .get("/api/articles/2/comments")
            .expect(200)
            .then(res => {
              expect(res.body.comments).to.eql([]);
            });
        });
        it("GET: 200 - responds with all comments for the given article_id, ordered by user specified query", () => {
          return request(app)
            .get("/api/articles/1/comments?order=asc")
            .expect(200)
            .then(res => {
              expect(res.body).to.be.an("object");
              expect(res.body.comments).to.be.sortedBy("created_at", {
                descending: false
              });
            });
        });
        it("GET: 400 - Throws an error when trying to query a non-existent column", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=banana")
            .expect(400)
            .then(res => {
              expect(res.body.msg).to.equal("Invalid query");
            });
        });
        it("GET: 404 - Throws an error when trying to query a non-existent article_id", () => {
          return request(app)
            .get("/api/articles/9999/comments")
            .expect(404)
            .then(res => {
              expect(res.body.msg).to.equal("404, Not found!");
            });
        });
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
              expect(res.body.comment).to.have.keys(
                "comment_id",
                "author",
                "article_id",
                "votes",
                "created_at",
                "body"
              );
              expect(res.body.comment.body).to.eql("test comment");
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
        it("POST: 404 - Throws an error when trying to submit a comment to a non-existent article", () => {
          return request(app)
            .post("/api/articles/9999/comments")
            .send({
              username: "icellusedkars",
              body: "test comment"
            })
            .expect(404)
            .then(res => {
              expect(res.body.msg).to.equal("404, Not found!");
            });
        });
      });
      it("GET: 200 - Responds with an article object with all article tables as properties plus an added 'comment_count' property that comes from comments", () => {
        return request(app)
          .get("/api/articles/1")
          .then(res => {
            expect(res.body).to.be.an("object");
            expect(res.body.article).to.contain.keys(
              "article_id",
              "author",
              "title",
              "body",
              "topic",
              "created_at",
              "votes",
              "comment_count"
            );
            expect(res.body.article.article_id).to.equal(1);
          });
      });
      it("GET: 200 - Responds with an article object for an article that has 0 comments as well", () => {
        return request(app)
          .get("/api/articles/2")
          .then(res => {
            expect(res.body).to.be.an("object");
            expect(res.body.article).to.contain.keys(
              "article_id",
              "author",
              "title",
              "body",
              "topic",
              "created_at",
              "votes",
              "comment_count"
            );
            expect(res.body.article.article_id).to.equal(2);
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
            expect(res.body.article.votes).to.equal(110);
          });
      });
      it("PATCH:200 - the request works for negative numbers too", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: -10 })
          .expect(200)
          .then(res => {
            expect(res.body).to.be.an("object");
            expect(res.body.article.votes).to.equal(90);
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
      it("PATCH: 200 - Ignore the patch request that has no information in the request body and send back the unchanged article", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({})
          .expect(200)
          .then(res => {
            expect(res.body).to.be.an("object");
            expect(res.body.article.votes).to.equal(100);
          });
      });
      it("DELETE: 204 - Delete an article specified by the parameter(article_id)", () => {
        return request(app)
          .delete("/api/articles/3")
          .expect(204);
      });
      it("DELETE: 404 - Throws an error when trying to delete a non existent article", () => {
        return request(app)
          .delete("/api/articles/99999")
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.equal("404, Not found!");
          });
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
