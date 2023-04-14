const express = require("express");
const { randomBytes } = require("crypto");
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require("cors");
const app = express();
app.use(bodyParser.json()).use(cors());
const commentsbyPostId = {};

app
  .get("/posts/:id/comments", (req, res) => {
    res.send(commentsbyPostId) || [];
  })
  .post("/posts/:id/comments", async (req, res) => {
    const commentsId = randomBytes(4).toString("hex");
    const { content } = req.body;
    const postsId = req.params.id;
    // console.log(postsId);
    const comments = commentsbyPostId[req.params.id] || [];
    comments.push({
      id: commentsId,
      content,
    });
    commentsbyPostId[req.params.id] = comments;
    await axios.post("http://localhost:4005/events", {
      type: "CommentCreated",
      data: {
        id: commentsId,
        content,
        postId: postsId,
        status: "pending",
      },
    });
    res.status(201).send(comments);
  })
  .post("/events", async (req, res) => {
    console.log("recive Events:", req.body.type);
    const { type, data } = req.body;
    if (type === "CommentModerated") {
      const { postId, id, status, content } = data;
      const commetns = commentsbyPostId[postId];
      const comment = commetns.find((content) => content.id === id);
      comment.status = status;
      await axios.post("http://localhost:4005/events", {
        type: "CommentUpdated",
        data: {
          postId,
          id,
          status,
          content,
        },
      });
    }
    res.send({});
  })
  .listen(4001, () => console.log("comment Listening on 4001"));
