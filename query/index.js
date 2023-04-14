const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json()).use(cors());
const posts = {};

app
  .get("/posts", (req, res) => {
    res.send(posts);
  })
  .post("/events", (req, res) => {
    const { type, data } = req.body;
    heaandelEvents(type, data);
    console.log("posts", posts);
    res.send({});
  })
  .listen(4002, async () => {
    console.log("query listening at 4002");
    const res = await axios.get("http://localhost:4005/events");
    for (let event of res.data) {
      console.log("processing event:", event.type);
      heaandelEvents(event.type, event.data);
    }
  });

const heaandelEvents = (type, data) => {
  if (type === "PostCreated") {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }
  if (type === "CommentCreated") {
    const { id, content, postId, status } = data;
    const post = posts[postId];

    post.comments.push({
      id,
      content,
      status,
    });
  }
  if (type === "CommentUpdated") {
    const { postId, id, status, content } = data;
    console.log("data", data);
    console.log("status", status);
    const post = posts[postId];
    console.log(
      "test334",
      post.comments.find((comment) => comment.id === id)
    );
    const comment = post.comments.find((comment) => comment.id === id);
    comment.status = status;
    comment.content = content;
  }
};
