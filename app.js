const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 5000;
const rateLimit = require("express-rate-limit");
const { MONGOURI } = require("./config/keys.js");

mongoose.connect(MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.log("Failed to connect due to ", err);
});

require("./models/user");
require("./models/post");

var limiter = new rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 50,
});

app.use(express.json());
app.use(cors());

app.use("/", limiter);
app.use("/api", limiter);
app.use("/api", require("./routes/auth"));
app.use("/api", require("./routes/post"));
app.use("/api", require("./routes/user"));

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  next();
});

if (process.env.NODE_ENV == "production") {
  app.use(express.static("client/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(PORT, (err) => {
  if (err) {
    console.log(`Error while running app : ${err}`);
  } else {
    console.log(`Server is running on ${PORT}`);
  }
});
