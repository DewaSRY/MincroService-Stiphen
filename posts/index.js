const express = require("express");
const { randomBytes } = require("crypto");
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require("cors");
const app = express();
app.use(bodyParser.json()).use(cors());
const posts = {};

app
  .get("/posts", (req, res) => {
    res.send(posts);
  })
  .post("/posts", async (req, res) => {
    const id = randomBytes(4).toString("hex");
    const { title } = req.body;
    posts[id] = {
      id,
      title,
    };
    await axios.post("http://localhost:4005/events", {
      type: "PostCreated",
      data: {
        id,
        title,
      },
    });
    res.status(201).send(posts[id]);
  })
  .post("/events", (req, res) => {
    console.log("recive Events", req.body.type);
    res.send({});
  })
  .listen(4000, () => console.log("posts Listening on 4000"));
