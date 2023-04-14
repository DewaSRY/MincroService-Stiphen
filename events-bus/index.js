const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const events = [];
const app = express();
app.use(bodyParser.json()).use(cors());

app
  .get("/events", (req, res) => {
    return res.send(events);
  })
  .post("/events", async (req, res) => {
    const event = req.body;
    events.push(event);
    await axios.post("http://localhost:4000/events", event).catch((err) => {
      console.log("post", err.message);
    });
    await axios.post("http://localhost:4001/events", event).catch((err) => {
      console.log("comment", err.message);
    });
    await axios.post("http://localhost:4002/events", event).catch((err) => {
      console.log("query", err.message);
    });
    await axios.post("http://localhost:4003/events", event).catch((err) => {
      console.log("moderation", err.message);
    });
    return res.send({ status: "OK" });
  })
  .listen(4005, () => console.log("event-bus listening at 4005"));
