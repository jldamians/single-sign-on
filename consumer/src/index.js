"use strict";

const cors = require("cors");
const logger = require("morgan");
const engine = require("ejs-mate");
const express = require("express");
const cookie = require("cookie-parser");
const session = require("express-session");

const { isAuthenticated } = require("./controllers");

// initializations

const app = express();

// settings

app.engine("ejs", engine);

app.set("json spaces", 2);

app.set("port", 80);

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "/views"));

// middlewares

app.use(cors({
  credentials: true,
}));

app.use("/static", express.static(
  path.join(__dirname, "/public")
));

app.use(cookie());

app.use(session({
  name: "app.session.web",
  secret: "9XgjWnYOLQduSof0KR3yzJHik6CTa8cV",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 5,
  },
}));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(logger("dev"));

// routes

app.get("/", isAuthenticated, function(req, res, next) {
  res.render("me", {
    information: JSON.stringify(req.session.user),
    title: "Factur@ctiva",
  })
})

// starting the server

app.listen(80, function() {
  console.log("Listening on port 80");
});
