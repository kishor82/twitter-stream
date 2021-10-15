const dotenv = require("dotenv");
const http = require("http");
const path = require("path");
const bodyParser = require("body-parser");
const express = require("express");
const boom = require("boom");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
dotenv.config();

const keys = require("./config/keys");
const tweets = require("./api/tweets.js");
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

app.use(cors());
// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use(bodyParser.json());
app.set("x-powered-by", false);
global.io = io; // assigned to use in twitter services TODO: find alternative

app.use(express.static("client/build"));
// DB Config
const db = keys.MONGO_URI;
// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB successfully connected."))
  .catch((err) => console.log({ err }));

// Routes
app.use("/api/tweets", tweets);

//Frontend
app.use(function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

// Error handling
app.use(async (err, req, res, next) => {
  if (res.output || err) {
    return res
      .status(err.output ? err.output.statusCode : err.statusCode)
      .send(boom.boomify(err).output);
  }
});

io.on("connection", async () => {
  console.log("Socket Client connected...");
});

const port = process.env.PORT || 7781;

httpServer.listen(port, () =>
  console.log(`Server up and running on port ${port} !`)
);
