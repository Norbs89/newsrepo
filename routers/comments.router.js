const commentsRouter = require("express").Router();
const sendUpdatedComment = require("../controllers/comments.controller");

commentsRouter.route("/:comment_id").patch(sendUpdatedComment);

module.exports = commentsRouter;
